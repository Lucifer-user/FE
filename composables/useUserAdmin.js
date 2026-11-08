import { ref } from 'vue'

const users = ref([]);
const currentUserDetail = ref(null);
const loading = ref(false);
const totalPages = ref(1);
const totalUsers = ref(0);

export default function useUserAdmin() {
    const config = useRuntimeConfig();
    const toast = useToast();

    const fetchUsers = async (params = { page: 1, limit: 5, search: '', status: '' }) => {
        loading.value = true;
        try {
            const token = useCookie('accessToken').value;
            let endpoint = `${config.public.apiBase}/admin/users`;
            let queryParams = new URLSearchParams();
            
            if (params.search) queryParams.append('search', params.search);
            if (params.limit) queryParams.append('per_page', params.limit);
            if (params.page) queryParams.append('page', params.page);

            if (params.status === 'deleted') {
                endpoint = `${config.public.apiBase}/admin/users/trash`;
            } else if (params.status) {
                queryParams.append('status', params.status);
            }

            const response = await $fetch(`${endpoint}?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response && response.status === 'success') {
                users.value = response.data.map(user => ({
                    ...user,
                    fullName: user.name,
                    created_at: user.registration_date // Căn chỉnh lại key theo backend trả về
                }));
                
                if (response.pagination) {
                    totalPages.value = response.pagination.last_page;
                    totalUsers.value = response.pagination.total;
                } else {
                    // Endpoint trash không có pagination nên set cứng
                    totalPages.value = 1;
                    totalUsers.value = response.data.length;
                }
            }
        } catch (error) {
            console.error('Lỗi khi fetchUsers:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Bạn không có quyền truy cập dữ liệu Quản trị viên!');
            } else {
                toast.error('Lỗi khi tải danh sách người dùng. Vui lòng thử lại.');
            }
            users.value = [];
        } finally {
            loading.value = false;
        }
    };

    const inviteUser = async (email, role) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: { email, role }
            });
            return response;
        } catch (error) {
            console.error('Lỗi khi inviteUser:', error);
            toast.error(error.response?._data?.message || 'Không thể tạo người dùng. Vui lòng thử lại.');
            return null;
        }
    };

    const updateStatus = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/${id}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi updateStatus:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi cập nhật trạng thái.');
            return false;
        }
    };

    const updateUserRole = async (id, role) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: { role }
            });
            if (response && response.status === 'success') {
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Lỗi updateUserRole:', error);
            if (error.response?.status === 403) {
                return { success: false, error: 'own_role' };
            }
            return { success: false, error: 'server_error' };
        }
    };

    const softDeleteUser = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi softDeleteUser:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi đưa vào thùng rác.');
            return false;
        }
    };

    const restoreUser = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/${id}/restore`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi restoreUser:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi khôi phục người dùng.');
            return false;
        }
    };

    const hardDeleteUser = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/users/${id}/force`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi hardDeleteUser:', error);
            toast.error(error.response?._data?.message || 'Không thể xóa vĩnh viễn người dùng.');
            return false;
        }
    };

    const fetchUserDetails = async (id) => { 
        // Mock function for now, as we don't have a specific detail endpoint in the plan
        currentUserDetail.value = users.value.find(u => u.id === id) || { id, fullName: 'Unknown User' }; 
    };

    const getExportCsvUrl = (search = '', status = '') => {
        const token = useCookie('accessToken').value;
        let queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (status) queryParams.append('status', status);
        // Do URL xuất CSV cần mở tab mới, token thường được truyền qua query nếu không thể set Header.
        // Tuy nhiên do API yêu cầu header Authorization, ta có thể dùng fetch để download Blob
        return `${config.public.apiBase}/admin/users/export-csv?${queryParams.toString()}`;
    };

    const exportCsv = async (search = '', status = '') => {
        try {
            const token = useCookie('accessToken').value;
            const url = getExportCsvUrl(search, status);
            const response = await $fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob'
            });

            // Create a link to download the blob
            const blobUrl = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `users_export_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Lỗi exportCsv:', error);
            toast.error('Lỗi khi xuất CSV.');
        }
    };

    return { 
        users, 
        currentUserDetail, 
        loading, 
        totalPages, 
        totalUsers,
        fetchUsers, 
        fetchUserDetails, 
        updateStatus, 
        softDeleteUser, 
        restoreUser,
        hardDeleteUser,
        inviteUser,
        updateUserRole,
        exportCsv
    };
}
