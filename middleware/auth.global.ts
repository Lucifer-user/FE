import { defineNuxtRouteMiddleware, navigateTo, useCookie, useRuntimeConfig } from '#app'
import { joinApiUrl } from '~/utils/adminBilling'
import { extractAuthenticatedRole } from '~/utils/auth/role'

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip if already on login page (case-insensitive check)
  if (to.path.toLowerCase() === '/login') return;

  const cookieOptions = { sameSite: 'lax' as const, secure: import.meta.env.PROD, path: '/' }
  const token = useCookie<string | null>('accessToken', cookieOptions)
  const user = useCookie<Record<string, unknown> | null>('orbit_ai_user', cookieOptions)

  if (to.path.startsWith('/admin')) {
    if (!token.value) return navigateTo('/Login')

    try {
      const config = useRuntimeConfig()
     const apiBase = import.meta.server
  ? config.apiBaseInternal
  : config.public.apiBase

        const response = await $fetch<unknown>(
          joinApiUrl(apiBase, '/auth/user-roles'),
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
              Accept: 'application/json'
            }
          }
        )
      const role = extractAuthenticatedRole(response)

      if (role !== 'admin') {
        return navigateTo('/partner/home')
      }

      if (user.value && typeof user.value === 'object') {
        user.value = { ...user.value, role: 'admin' }
      }
    } catch (error: any) {
      const status = Number(error?.statusCode || error?.response?.status || 0)
      const code = String(error?.data?.code || error?.response?._data?.code || '')
      if (status === 401) {
        token.value = null
        user.value = null
        return navigateTo('/Login')
      }
      if (status === 403 || code === 'ADMIN_ONLY') return navigateTo('/partner/home')

      console.error('[AUTH] Unable to verify admin session:', status || 'network-error')
      return navigateTo('/Login')
    }
  }

  if (to.path.startsWith('/partner')) {
    const roles = user.value?.role ? [user.value.role] : []
    if (!roles.includes('partner') && !roles.includes('admin')) {
        return navigateTo('/Login')
    }
  }
})
