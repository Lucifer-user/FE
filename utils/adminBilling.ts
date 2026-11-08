const secretKeyPattern = /password|secret|authorization|api[_-]?key|access[_-]?token|refresh[_-]?token|bearer/i

const getBillingLocale = (localeCode?: string) => {
  if (localeCode) return localeCode
  const cookieLanguage = typeof document !== 'undefined'
    ? document.cookie.match(/(?:^|;\s*)i18n_redirected=([^;]+)/)?.[1]
    : undefined
  const language = cookieLanguage || (typeof document !== 'undefined' ? document.documentElement.lang : 'vi')
  return language === 'en' ? 'en-US' : 'vi-VN'
}

export const normalizeApiBase = (value: unknown, fallback = '/api') => {
  const raw = String(value ?? '').trim()
  if (!raw || raw === '/') return fallback

  const withoutTrailingSlash = raw.replace(/\/+$/, '')
  if (/^https?:\/\//i.test(withoutTrailingSlash)) return withoutTrailingSlash

  return `/${withoutTrailingSlash.replace(/^\/+/, '')}`
}

export const joinApiUrl = (base: unknown, endpoint: string) => {
  const normalizedEndpoint = `/${String(endpoint || '').replace(/^\/+/, '')}`
  return `${normalizeApiBase(base)}${normalizedEndpoint}`
}

export const formatBillingMoney = (value: unknown, currency = 'VND', localeCode?: string) => {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat(getBillingLocale(localeCode), {
    style: 'currency',
    currency: currency || 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatBillingNumber = (value: unknown, localeCode?: string) => {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  return Number.isFinite(amount) ? new Intl.NumberFormat(getBillingLocale(localeCode)).format(amount) : '—'
}

export const formatBillingLimit = (value: unknown, localeCode?: string) => Number(value) === -1
  ? (getBillingLocale(localeCode) === 'en-US' ? 'Unlimited' : 'Không giới hạn')
  : formatBillingNumber(value, localeCode)

export const formatBillingDate = (value: unknown, includeTime = false, localeCode?: string) => {
  if (!value) return '—'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(getBillingLocale(localeCode), includeTime
    ? { dateStyle: 'short', timeStyle: 'short' }
    : { dateStyle: 'short' }).format(date)
}

export const toBillingInteger = (value: unknown): number | null => {
  if (value === '' || value === null || value === undefined) return null
  const normalized = typeof value === 'string' ? value.trim() : value
  const number = Number(normalized)
  return Number.isSafeInteger(number) ? number : null
}

export const compactBillingQuery = (values: Record<string, unknown>) => Object.fromEntries(
  Object.entries(values)
    .filter(([, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => [key, typeof value === 'boolean' ? (value ? 1 : 0) : value]),
)

export const sanitizeBillingOutput = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitizeBillingOutput)
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !secretKeyPattern.test(key))
      .map(([key, nested]) => [key, sanitizeBillingOutput(nested)]),
  )
}

export const formatBillingJson = (value: unknown) => JSON.stringify(sanitizeBillingOutput(value ?? {}), null, 2)

export const billingStatusLabel = (status: string | null | undefined) => ({
  pending: 'Chờ xử lý',
  success: 'Thành công',
  completed: 'Hoàn tất',
  paid: 'Đã thanh toán',
  failed: 'Thất bại',
  expired: 'Hết hạn',
  cancelled: 'Đã hủy',
  active: 'Đang hoạt động',
  expiring_soon: 'Sắp hết hạn',
  upcoming: 'Sắp hiệu lực',
}[String(status || '').toLowerCase()] || status || 'Không xác định')
