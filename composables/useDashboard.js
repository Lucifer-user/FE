import { ref } from 'vue'

export const useDashboard = () => {
    const config = useRuntimeConfig();
    const toast = useToast();

    const statCards = ref([
        { label: 'admin.home.stats.organizations', value: 0, sub: '+0%' },
        { label: 'admin.home.stats.active_users', value: 0, sub: '+0%' },
        { label: 'admin.home.stats.total_tokens', value: 0, sub: '+0%' },
        { label: 'admin.home.stats.system_status', value: 'admin.home.stats.stable' }
    ])
    const tableData = ref([])
    const topServices = ref([])
    const systemLogs = ref([])
    const loading = ref(false)

    const fetchDashboard = async (range = '24H') => {
        loading.value = true
        try {
            const token = useCookie('accessToken').value;
            const endpoint = `${config.public.apiBase}/admin/dashboard?range=${range.toLowerCase()}`;
            
            const response = await $fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response && response.status === 'success' && response.data) {
                statCards.value = response.data.statCards;
                tableData.value = response.data.tableData;
                topServices.value = response.data.topServices;
                systemLogs.value = response.data.systemLogs;
            }
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            toast.error('Lỗi khi tải dữ liệu thống kê. Vui lòng thử lại.');
        } finally {
            loading.value = false;
        }
    }

    const exportDashboardCsv = async (range = '24H') => {
        try {
            const token = useCookie('accessToken').value;
            const endpoint = `${config.public.apiBase}/admin/dashboard/export-csv?range=${range.toLowerCase()}`;
            
            const response = await $fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const blobUrl = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `dashboard_report_${range.toLowerCase()}_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting dashboard CSV:', error);
            toast.error('Lỗi khi tải file báo cáo.');
        }
    }

    const fetchDashboardStats = async () => {
        return {
            totalUsers: 1500, activeUsers: 1200, suspendedUsers: 50, newUsersToday: 15,
            revenue: 5000000, revenueGrowth: 12.5,
            recentActivities: [
                { id: 1, action: 'User Login', time: '2 mins ago' },
                { id: 2, action: 'New Registration', time: '5 mins ago' }
            ]
        }
    }

    return { statCards, tableData, topServices, systemLogs, fetchDashboard, exportDashboardCsv, loading, fetchDashboardStats }
}
