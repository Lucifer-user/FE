<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col justify-center items-center bg-white dark:bg-[#09090B] font-inter selection:bg-neon-cyan/30 transition-colors duration-500 px-4 py-8 sm:px-0 sm:py-0">
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute w-[800px] h-[800px] top-[-200px] left-[-200px] rounded-full bg-indigo-500/5 dark:bg-deep-purple/20 blur-[120px] animate-pulse"></div>
      <div class="absolute w-[600px] h-[600px] bottom-[-100px] right-[-100px] rounded-full bg-emerald-500/5 dark:bg-neon-cyan/20 blur-[100px] animate-pulse" style="animation-delay: 2s;"></div>
      
      <template v-if="isMounted">
        <div v-for="i in 50" :key="'star-'+i" 
             class="absolute rounded-full bg-slate-900 dark:bg-white animate-twinkle z-[1] opacity-[0.05] dark:opacity-100"
             :style="starStyles[i-1]">
        </div>
        
        <div v-for="i in 3" :key="'shooting-'+i" 
             class="absolute h-[1px] bg-gradient-to-r from-transparent via-indigo-500 dark:via-white to-transparent opacity-0 animate-shooting-star z-[2]"
             :style="shootingStarStyles[i-1]">
        </div>
      </template>
    </div>

    <NuxtLink to="/" class="absolute top-5 left-5 sm:top-8 sm:left-8 z-20 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-indigo-600 dark:hover:text-neon-cyan transition-all duration-300 group transition-colors">
      <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
      {{ $t('auth.login.back_to_platform') }}
    </NuxtLink>

    <main class="relative z-10 w-full max-w-md px-0 sm:px-6 animate-fade-in">
      <div class="bg-white/80 dark:bg-white/5 backdrop-blur-[32px] rounded-[28px] sm:rounded-[32px] border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col items-center transition-colors">
        <div class="mb-8 flex items-center justify-center gap-3">
          <div class="relative">
            <span class="material-symbols-outlined text-indigo-600 dark:text-neon-cyan text-4xl transition-colors" style="font-variation-settings: 'FILL' 1;">all_inclusive</span>
            <div class="absolute -inset-2 bg-indigo-500/20 dark:bg-neon-cyan/30 blur-lg rounded-full animate-pulse transition-colors"></div>
          </div>
          <span class="font-display text-3xl font-bold bg-gradient-to-r from-indigo-600 dark:from-neon-cyan to-purple-600 dark:to-deep-purple bg-clip-text text-transparent drop-shadow-sm transition-colors">Orbit AI</span>
        </div>

        <div class="text-center mb-10 w-full">
          <h1 class="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{{ $t('auth.login.welcome_back') }}</h1>
          <p class="text-slate-500 dark:text-white/50 text-sm tracking-wide transition-colors">{{ $t('auth.login.welcome_desc') }}</p>
        </div>

        <div class="w-full flex flex-col gap-3 mb-8">
          <button @click="handleGoogleLogin" :disabled="isLoading" 
                  class="relative group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 overflow-hidden disabled:opacity-50">
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500/5 dark:from-neon-cyan/10 to-transparent transition-opacity duration-300"></div>
            <img src="/icons/google.svg" alt="Google" class="relative z-10 h-5 w-5" />
            <span class="text-sm font-bold text-slate-700 dark:text-white/80 relative z-10 tracking-wide transition-colors">{{ $t('auth.login.google_login') }}</span>
          </button>
        </div>

        <div class="flex items-center w-full mb-8">
          <div class="flex-1 border-t border-slate-100 dark:border-white/10"></div>
          <span class="px-4 text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">{{ $t('auth.login.secure_sequence') }}</span>
          <div class="flex-1 border-t border-slate-100 dark:border-white/10"></div>
        </div>

        <form class="w-full flex flex-col gap-5" novalidate @submit.prevent="handleEmailLogin">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
              <span class="material-symbols-outlined text-xl">mail</span>
            </div>
            <input v-model="email" type="email" id="email" :placeholder="$t('auth.login.email_placeholder')" :disabled="isLoading"
                   class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
              <span class="material-symbols-outlined text-xl">lock</span>
            </div>
            <input v-model="password" type="password" id="password" :placeholder="$t('auth.login.password_placeholder')" :disabled="isLoading"
                   class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
          </div>

          <div class="flex flex-col min-[360px]:flex-row min-[360px]:items-center justify-between gap-3 px-1">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" class="w-4 h-4 rounded border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-indigo-600 dark:text-neon-cyan focus:ring-indigo-500 dark:focus:ring-neon-cyan focus:ring-offset-0 transition-all" />
              <span class="text-xs text-slate-400 dark:text-white/40 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors">{{ $t('auth.login.remember_device') }}</span>
            </label>
            <NuxtLink to="/user/ForgotPassword" class="text-xs font-bold text-indigo-600 dark:text-neon-cyan hover:text-slate-900 dark:hover:text-white transition-colors">{{ $t('auth.login.forgot_sequence') }}</NuxtLink>
          </div>
          <div class="flex justify-center mb-6">
            <NuxtTurnstile :key="turnstileWidgetKey" v-model="turnstileToken" />
          </div>
          <button type="submit" :disabled="isLoading"
                  class="w-full min-h-14 py-4 mt-2 rounded-2xl font-bold text-xs sm:text-sm text-white dark:text-slate-900 bg-gradient-to-r from-indigo-600 dark:from-neon-cyan to-purple-600 dark:to-deep-purple shadow-xl dark:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-2xl dark:hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 relative overflow-hidden group">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span class="relative z-10 flex flex-wrap items-center justify-center gap-2 uppercase tracking-[0.16em] sm:tracking-widest leading-none">
              {{ isLoading ? $t('auth.login.initializing') : $t('auth.login.initialize_session') }}
              <span class="material-symbols-outlined text-lg leading-none">bolt</span>
            </span>
          </button>
        </form>

        <p class="mt-10 text-xs text-slate-400 dark:text-white/30 tracking-wide transition-colors text-center">
          {{ $t('auth.login.request_access') }} <NuxtLink to="/user/Register" class="text-indigo-600 dark:text-neon-cyan hover:text-slate-900 dark:hover:text-white transition-colors font-bold ml-1">{{ $t('auth.login.deploy_instance') }}</NuxtLink>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { joinApiUrl } from '~/utils/adminBilling';
import { extractAuthenticatedRole } from '~/utils/auth/role';

definePageMeta({
  layout: 'auth-admin'
});

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const toast = useToast();
const { t } = useI18n();
const isMounted = ref(false);
const starStyles = ref([]);
const shootingStarStyles = ref([]);

const turnstileToken = ref('');
const turnstileWidgetKey = ref(0);

const onTurnstileVerify = (token) => {
  turnstileToken.value = token;
};

const resetTurnstile = () => {
  turnstileToken.value = '';
  turnstileWidgetKey.value += 1;
};

onMounted(() => {
  isMounted.value = true;
  
  starStyles.value = Array.from({ length: 50 }).map(() => ({
    width: Math.random() * 2 + 'px',
    height: Math.random() * 2 + 'px',
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's',
    opacity: Math.random() * 0.7 + 0.3
  }));

  shootingStarStyles.value = Array.from({ length: 3 }).map(() => ({
    width: (Math.random() * 150 + 100) + 'px',
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    transform: 'rotate(-45deg)',
    animationDelay: (Math.random() * 20) + 's',
    animationDuration: (Math.random() * 5 + 5) + 's'
  }));
});

const handleBackendAuth = async (firebaseIdToken) => {
  const { auth, signOut } = await import('~/utils/auth/firebase.js');
  const config = useRuntimeConfig();
  const cookieOptions = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: import.meta.env.PROD, path: '/' };
  const tokenCookie = useCookie('accessToken', cookieOptions);
  const userCookie = useCookie('orbit_ai_user', cookieOptions);

  try {
    const data = await $fetch(joinApiUrl(config.public.apiBase, '/auth/login'), {
      method: 'POST',
      body: { 
        idToken: firebaseIdToken,
        captchaToken: turnstileToken.value 
      },
    });

    if (data.status === 'success') {
      tokenCookie.value = data.token;

      const userRolesData = await $fetch(joinApiUrl(config.public.apiBase, '/auth/user-roles'), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${data.token}`
        }
      });

      const userRole = extractAuthenticatedRole(userRolesData);
      
      userCookie.value = {
        name: auth.currentUser?.displayName || 'Orbit User',
        email: auth.currentUser?.email || '',
        photoURL: auth.currentUser?.photoURL || '',
        role: userRole || 'partner'
      };

      if (data.user?.locale) {
        const i18nCookie = useCookie('i18n_redirected', { maxAge: 60 * 60 * 24 * 7 });
        i18nCookie.value = data.user.locale;
      }

      toast.success(t('auth.login.toast_login_success'));

      if (userRole === 'admin') {
        window.location.href = '/admin';
      } else if (userRole === 'partner') {
        window.location.href = '/partner/home';
      } else {
        window.location.href = '/';
      }
    } else {
      throw new Error(data.message || t('auth.login.toast_auth_fail'));
    }
  } catch (error) {
    console.error('Backend auth failed:', error?.statusCode || 'unknown');
    
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error('Sign out failed after auth error:', signOutError);
    }
    
    const message = error.response?._data?.message || error.message || t('auth.login.toast_gateway_err');
    toast.error(message);
    resetTurnstile();
  }
};

const handleEmailLogin = async () => {
  if (!process.client) return;

  if (!turnstileToken.value) {
    toast.error(t('auth.login.toast_turnstile_req'));
    return;
  }

  if (!email.value.trim()) {
    toast.warning(t('auth.login.toast_email_required'));
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    toast.warning(t('auth.login.invalid_email'));
    return;
  }

  if (!password.value) {
    toast.warning(t('auth.login.toast_pass_required'));
    return;
  }

  isLoading.value = true;

  try {
    const emailAddress = email.value.trim();

    const config = useRuntimeConfig();
    const checkEmailResponse = await $fetch(joinApiUrl(config.public.apiBase, '/auth/check-email'), {
      method: 'POST',
      body: { email: emailAddress }
    });

    if (!checkEmailResponse.exists) {
      toast.error(t('auth.login.toast_account_not_registered'));
      isLoading.value = false;
      resetTurnstile();
      return;
    }

    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('~/utils/auth/firebase.js');

    const credential = await signInWithEmailAndPassword(auth, emailAddress, password.value);
    const idToken = await credential.user.getIdToken(true);

    await handleBackendAuth(idToken);
  } catch (error) {
    console.error('Firebase Email login failed:', error);
    const wrongPasswordCodes = [
      'auth/wrong-password',
      'auth/invalid-credential',
      'auth/invalid-login-credentials',
    ];

    if (wrongPasswordCodes.includes(error?.code)) {
      toast.error(t('auth.login.toast_wrong_password'));
    } else if (error?.response?._data?.message) {
      toast.error(error.response._data.message);
    } else {
      toast.error(t('auth.login.toast_gateway_err'));
    }
    resetTurnstile();
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = async () => {
  if (!process.client) return;

  if (!turnstileToken.value) {
    toast.error(t('auth.login.toast_turnstile_google_req'));
    return;
  }
  isLoading.value = true;
  try {
    const { signInWithPopup } = await import('firebase/auth');
    const { auth, provider } = await import('~/utils/auth/firebase.js');

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    await handleBackendAuth(idToken);
  } catch (error) {
    console.error('Google login failed:', error);
    toast.error(t('auth.login.toast_google_fail'));
    resetTurnstile();
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Login - Orbit AI',
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap' }
  ]
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.animate-twinkle {
  animation: twinkle ease-in-out infinite;
}

@keyframes shooting-star {
  0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 0; }
  10% { opacity: 1; }
  20% { transform: translateX(-500px) translateY(500px) rotate(-45deg); opacity: 0; }
  100% { transform: translateX(-500px) translateY(500px) rotate(-45deg); opacity: 0; }
}

.animate-shooting-star {
  animation: shooting-star linear infinite;
}

.font-display {
  font-family: 'Space Grotesk', sans-serif;
}
</style>
