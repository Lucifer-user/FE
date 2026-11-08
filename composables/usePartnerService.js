import { ref } from 'vue'
export const usePartnerServices = () => {
    const services = ref([]);
    const loading = ref(false);

    const loadServices = async () => {
        loading.value = true;
        setTimeout(() => {
            services.value = [ { id: '1', name: 'Mock Service', description: 'Mock description' } ];
            loading.value = false;
        }, 500);
    }
    const loadPublicServices = async () => {
        loading.value = true;
        setTimeout(() => {
            services.value = [
                {
                    id: '1392a458-889d-4825-a2b9-9dc1bc4c6e69',
                    name: 'Tour Khám Phá Biển Đảo',
                    description: 'Dịch vụ du lịch trọn gói hè',
                    status: 'active',
                    type: 'tour',
                    features: ['Hỗ trợ tư vấn 24/7', 'Tự động báo giá', 'Chăm sóc khách hàng']
                },
                {
                    id: 'b1b2b3b4-1111-4444-8888-abcdefabcdef',
                    name: 'Bàn Tiệc Gia Đình VIP',
                    description: 'Đặt bàn tiệc khu vực sân thượng view biển',
                    status: 'active',
                    type: 'booking',
                    features: ['Hỗ trợ tư vấn 24/7', 'Tự động báo giá', 'Chăm sóc khách hàng']
                }
            ];
            loading.value = false;
        }, 500);
        return services.value;
    }

    return { services, loading, loadServices, loadPublicServices }
}
