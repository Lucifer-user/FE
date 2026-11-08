import { ref } from 'vue'

const normalizeApiBase = (value) => String(value || '/api').replace(/\/+$/, '')
const sortCatalogItems = (items) => [...items].sort((left, right) => {
  const orderDifference = Number(left?.sort_order ?? Number.MAX_SAFE_INTEGER)
    - Number(right?.sort_order ?? Number.MAX_SAFE_INTEGER)

  if (orderDifference !== 0) return orderDifference
  return String(left?.code ?? left?.id ?? '').localeCompare(String(right?.code ?? right?.id ?? ''))
})

export const useBillingCatalog = () => {
  const plans = useState('public-billing-plans', () => [])
  const topupPackages = useState('public-billing-topup-packages', () => [])
  const loaded = useState('public-billing-catalog-loaded', () => false)
  const loadError = useState('public-billing-catalog-error', () => '')
  const loading = ref(false)

  const load = async (force = false) => {
    if ((!force && loaded.value) || loading.value) return

    loading.value = true
    try {
      const config = useRuntimeConfig()
      const apiBase = normalizeApiBase(config.public.apiBase)
      const [planResponse, topupResponse] = await Promise.all([
        $fetch(apiBase + '/billing/plans'),
        $fetch(apiBase + '/billing/topup-packages'),
      ])

      plans.value = sortCatalogItems(Array.isArray(planResponse?.data) ? planResponse.data : [])
      topupPackages.value = sortCatalogItems(Array.isArray(topupResponse?.data) ? topupResponse.data : [])
      loadError.value = ''
      loaded.value = true
    } catch (error) {
      // An empty successful catalog is authoritative and is never replaced
      // by hard-coded plan data in presentation components.
      console.error('Unable to load public billing catalog', error)
      loadError.value = 'Unable to load billing catalog'
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const reload = () => load(true)

  return { plans, topupPackages, loaded, loadError, loading, load, reload }
}
