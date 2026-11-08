import { ref } from 'vue'

export const useOrganization = () => {
    const config = useRuntimeConfig();
    const toast = useToast();
    const organizations = ref([]);
    const loading = ref(false);

    const fetchOrganizations = async () => {
        loading.value = true;
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/organizations`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response) {
                organizations.value = response;
            }
        } catch (error) {
            console.error('Lỗi khi fetchOrganizations:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Bạn không có quyền truy cập dữ liệu Tổ chức!');
            } else {
                toast.error('Lỗi khi tải danh sách tổ chức. Vui lòng thử lại.');
            }
            organizations.value = [];
        } finally {
            loading.value = false;
        }
        return organizations.value;
    }

    const toggleStatus = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/organizations/${id}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                
                // Update local state
                const idx = organizations.value.findIndex(o => o.id === id);
                if (idx !== -1) {
                    organizations.value[idx].status = response.data.status;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi toggleStatus:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi cập nhật trạng thái.');
            return false;
        }
    };

    const updateOrganization = async (id, payload) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/organizations/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: payload
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                
                // Update local state
                const idx = organizations.value.findIndex(o => o.id === id);
                if (idx !== -1) {
                    Object.assign(organizations.value[idx], payload);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi updateOrganization:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi cập nhật thông tin.');
            return false;
        }
    };

    const updatePlanForTesting = async (id, payload) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/organizations/${id}/plan-test`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: payload
            });

            if (response && response.status === 'success') {
                toast.success(response.message);

                const idx = organizations.value.findIndex(o => o.id === id);
                if (idx !== -1 && response.data) {
                    organizations.value[idx] = {
                        ...organizations.value[idx],
                        ...response.data
                    };
                }

                return response.data || true;
            }

            return false;
        } catch (error) {
            console.error('Lỗi updatePlanForTesting:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi cập nhật thời hạn gói test.');
            return false;
        }
    };

    const deleteOrganization = async (id) => {
        try {
            const token = useCookie('accessToken').value;
            const response = await $fetch(`${config.public.apiBase}/admin/organizations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (response && response.status === 'success') {
                toast.success(response.message);
                
                // Remove from local state
                organizations.value = organizations.value.filter(o => o.id !== id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Lỗi deleteOrganization:', error);
            toast.error(error.response?._data?.message || 'Lỗi khi xóa tổ chức.');
            return false;
        }
    };

    const exportCsv = async () => {
        try {
            const token = useCookie('accessToken').value;
            const url = `${config.public.apiBase}/admin/organizations/export-csv`;
            const response = await $fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob'
            });

            const blobUrl = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `organizations_export_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Lỗi exportCsv:', error);
            toast.error('Lỗi khi xuất CSV.');
        }
    };

    return { 
        organizations, 
        fetchOrganizations, 
        loading,
        toggleStatus,
        updateOrganization,
        updatePlanForTesting,
        deleteOrganization,
        exportCsv
    }
}
