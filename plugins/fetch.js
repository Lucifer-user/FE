export default defineNuxtPlugin((nuxtApp) => {
    const i18nCookie = useCookie('i18n_redirected');
    
    // Create a global fetch interceptor
    globalThis.$fetch = $fetch.create({
      onRequest({ request, options }) {
        options.headers = options.headers || {};
        // Set the language from cookie or default to 'vi'
        options.headers['Accept-Language'] = i18nCookie.value || 'vi';
      }
    });
});
