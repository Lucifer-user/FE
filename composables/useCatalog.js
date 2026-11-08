import { ref } from 'vue'
export const useCatalog = () => {
    const catalog = ref([ { id: 'cat1', name: 'Test Catalog' } ]);
    const fetchCatalog = async () => { return catalog.value; }
    return { catalog, fetchCatalog }
}
