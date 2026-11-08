export const useAuthToken = () => {
  const cookieOptions = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: import.meta.env.PROD, path: '/' }
  const token = useCookie('accessToken', cookieOptions)
  const user = useCookie('orbit_ai_user', cookieOptions)

  const isAuthenticated = computed(() => !!token.value)

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    logout
  }
}
