import { ref } from 'vue'
export default function useServices() {
    const services = ref([ { id: 's1', name: 'AI Chat', status: 'active' } ]);
    const fetchServices = async () => { return services.value; }
    return { services, fetchServices }
}
