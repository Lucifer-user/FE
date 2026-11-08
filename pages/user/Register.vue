<template>
  <div class="min-h-screen relative overflow-hidden flex flex-col justify-center items-center bg-white dark:bg-[#09090B] font-inter selection:bg-neon-cyan/30 transition-colors duration-500 px-4 py-8 sm:px-0 sm:py-12">
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute w-[1000px] h-[1000px] top-[-300px] right-[-200px] rounded-full bg-indigo-500/5 dark:bg-deep-purple/20 blur-[150px] animate-pulse"></div>
      <div class="absolute w-[800px] h-[800px] bottom-[-200px] left-[-200px] rounded-full bg-emerald-500/5 dark:bg-neon-cyan/20 blur-[120px] animate-pulse" style="animation-delay: 3s;"></div>
      
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

    <NuxtLink to="/login" class="absolute top-5 left-5 sm:top-8 sm:left-8 z-20 inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 hover:text-indigo-600 dark:hover:text-neon-cyan transition-all duration-300 group transition-colors">
      <span class="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
      {{ $t('auth.register.back_to_login') }}
    </NuxtLink>

    <main class="relative z-10 w-full max-w-lg px-0 sm:px-6 animate-fade-in">
      <div class="bg-white/80 dark:bg-white/5 backdrop-blur-[32px] rounded-[28px] sm:rounded-[40px] border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col transition-colors">
        
        <div class="text-center mb-10">
          <div class="mb-4 flex items-center justify-center gap-3">
            <div class="relative">
              <span class="material-symbols-outlined text-indigo-600 dark:text-neon-cyan text-4xl transition-colors" style="font-variation-settings: 'FILL' 1;">add_circle</span>
              <div class="absolute -inset-2 bg-indigo-500/20 dark:bg-neon-cyan/30 blur-lg rounded-full animate-pulse transition-colors"></div>
            </div>
          </div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">{{ $t('auth.register.title') }}</h1>
          <p class="text-slate-500 dark:text-white/50 text-sm tracking-wide transition-colors">{{ $t('auth.register.subtitle') }}</p>
        </div>

        <div v-if="isSuccess" class="text-center py-8 animate-fade-in">
          <div class="mb-6 flex justify-center">
            <div class="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-pulse">
              <span class="material-symbols-outlined text-5xl text-emerald-600 dark:text-emerald-400">mark_email_read</span>
            </div>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">{{ $t('auth.register.success_title') }}</h2>
          <p class="text-slate-500 dark:text-white/70 mb-8 leading-relaxed">
            {{ $t('auth.register.success_desc') }}
            <strong class="text-slate-700 dark:text-white block mt-2 text-lg">{{ email }}</strong>
            <br>
            <span class="text-xs text-slate-400">{{ $t('auth.register.success_spam_note') }}</span>
          </p>
          <NuxtLink to="/login" class="inline-flex items-center justify-center min-h-14 px-8 rounded-2xl font-bold text-sm text-white dark:text-slate-900 bg-gradient-to-r from-indigo-600 dark:from-neon-cyan to-purple-600 dark:to-deep-purple shadow-xl hover:scale-[1.02] transition-all group">
            <span class="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
            {{ $t('auth.register.back_to_login') }}
          </NuxtLink>
        </div>

        <div v-else class="w-full">
          <form class="space-y-5" novalidate @submit.prevent="handleRegister">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
              <span class="material-symbols-outlined text-xl">person</span>
            </div>
            <input v-model="fullName" type="text" id="full-name" :placeholder="$t('auth.register.full_name')" :disabled="isLoading"
                   class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
          </div>

          <div class="relative group">
            <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
              <span class="material-symbols-outlined text-xl">mail</span>
            </div>
            <input v-model="email" type="email" id="email" :placeholder="$t('auth.register.email')" :disabled="isLoading"
                   class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
                <span class="material-symbols-outlined text-xl">lock</span>
              </div>
              <input v-model="password" type="password" id="password" :placeholder="$t('auth.register.password')" :disabled="isLoading"
                     class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
            </div>

            <div class="relative group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-white/20 group-focus-within:text-indigo-600 dark:group-focus-within:text-neon-cyan transition-colors">
                <span class="material-symbols-outlined text-xl">verified_user</span>
              </div>
              <input v-model="confirmPassword" type="password" id="confirm-password" :placeholder="$t('auth.register.confirm_password')" :disabled="isLoading"
                     class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-neon-cyan/50 focus:border-indigo-500/50 dark:focus:border-neon-cyan/50 block pl-12 p-4 transition-all placeholder-slate-300 dark:placeholder-white/10" />
            </div>
          </div>

          <label class="flex items-start gap-3 cursor-pointer group px-1">
            <input v-model="acceptTerms" type="checkbox" :disabled="isLoading"
                   class="mt-1 w-4 h-4 rounded border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-indigo-600 dark:text-neon-cyan focus:ring-indigo-500 dark:focus:ring-neon-cyan focus:ring-offset-0 transition-all" />
            <span class="text-xs text-slate-400 dark:text-white/40 group-hover:text-slate-600 dark:group-hover:text-white/60 transition-colors leading-relaxed">
              {{ $t('auth.register.terms') }}
            </span>
          </label>

          <button type="submit" :disabled="isLoading"
                  class="w-full min-h-14 py-4 mt-2 rounded-2xl font-bold text-xs sm:text-sm text-white dark:text-slate-900 bg-gradient-to-r from-indigo-600 dark:from-neon-cyan to-purple-600 dark:to-deep-purple shadow-xl dark:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-2xl dark:hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 relative overflow-hidden group">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span class="relative z-10 flex flex-wrap items-center justify-center gap-2 uppercase tracking-[0.14em] sm:tracking-widest leading-none">
              {{ isLoading ? $t('auth.register.btn_loading') : $t('auth.register.btn_submit') }}
              <span class="material-symbols-outlined text-lg leading-none">rocket_launch</span>
            </span>
          </button>
        </form>

        <div class="flex items-center w-full my-8">
          <div class="flex-1 border-t border-slate-100 dark:border-white/10"></div>
          <span class="px-4 text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">{{ $t('auth.register.protocol_sync') }}</span>
          <div class="flex-1 border-t border-slate-100 dark:border-white/10"></div>
        </div>

        <button @click="handleGoogleRegister" :disabled="isLoading" 
                class="relative group w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/5 overflow-hidden disabled:opacity-50 mb-8">
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500/5 dark:from-neon-cyan/10 to-transparent transition-opacity duration-300"></div>
          <img src="/icons/google.svg" alt="Google" class="relative z-10 h-5 w-5" />
          <span class="text-sm font-bold text-slate-700 dark:text-white/80 relative z-10 tracking-wide transition-colors">{{ $t('auth.register.google_register') }}</span>
        </button>

        <p class="text-center text-xs text-slate-400 dark:text-white/30 tracking-wide transition-colors">
          {{ $t('auth.register.already_registered') }} <NuxtLink to="/login" class="text-indigo-600 dark:text-neon-cyan hover:text-slate-900 dark:hover:text-white transition-colors font-bold ml-1 uppercase tracking-wider">{{ $t('auth.register.access_terminal') }}</NuxtLink>
        </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { joinApiUrl } from '~/utils/adminBilling';
import { extractAuthenticatedRole } from '~/utils/auth/role';

definePageMeta({
  layout: 'auth-admin'
});

const toast = useToast();
const { t } = useI18n();
const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptTerms = ref(false);
const isLoading = ref(false);
const isSuccess = ref(false);

const isMounted = ref(false);
const starStyles = ref([]);
const shootingStarStyles = ref([]);

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

const handleBackendAuth = async (firebaseIdToken, isRegister = false, selectedRole = 'partner') => {
  const config = useRuntimeConfig();
  const cookieOptions = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: import.meta.env.PROD, path: '/' };
  const tokenCookie = useCookie('accessToken', cookieOptions);
  const userCookie = useCookie('orbit_ai_user', cookieOptions);

  try {
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister 
      ? { idToken: firebaseIdToken, role: selectedRole } 
      : { idToken: firebaseIdToken };

    const data = await $fetch(joinApiUrl(config.public.apiBase, endpoint), {
      method: 'POST',
      body: payload,
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
      const { auth } = await import('~/utils/auth/firebase.js');

      userCookie.value = {
        name: auth.currentUser?.displayName || 'Orbit User',
        email: auth.currentUser?.email || '',
        role: userRole || 'partner'
      };

      if (userRole === 'admin') {
        await navigateTo('/admin');
      } else if (userRole === 'partner') {
        await navigateTo('/partner');
      } else {
        await navigateTo('/');
      }
    } else {
      throw new Error(data.message || 'Xác thực thất bại.');
    }
  } catch (error) {
    console.error('Backend auth failed:', error?.statusCode || 'unknown');
    const message = error.response?._data?.message || error.message || 'Thao tác thất bại. Vui lòng kiểm tra lại.';
    toast.error(message);
  }
};

const validateForm = () => {
  if (!fullName.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {
    toast.warning(t('auth.register.messages.incomplete_info'));
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    toast.warning(t('auth.register.messages.invalid_email'));
    return false;
  }

  if (fullName.value.trim().length < 2) {
    toast.warning(t('auth.register.messages.name_short'));
    return false;
  }

  if (password.value.length < 8) {
    toast.warning(t('auth.register.messages.password_short'));
    return false;
  }

  const hasUpperCase = /[A-Z]/.test(password.value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password.value);

  if (!hasUpperCase || !hasSpecialChar) {
    toast.warning(t('auth.register.messages.password_weak'));
    return false;
  }

  if (password.value !== confirmPassword.value) {
    toast.error(t('auth.register.messages.password_mismatch'));
    return false;
  }

  if (!acceptTerms.value) {
    toast.warning(t('auth.register.messages.terms_required'));
    return false;
  }

  return true;
};

const getRegisterErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return t('auth.register.messages.email_in_use');
    case 'auth/invalid-email':
      return t('auth.register.messages.invalid_email');
    case 'auth/weak-password':
      return t('auth.register.messages.weak_password_firebase');
    case 'auth/popup-closed-by-user':
      return t('auth.register.messages.popup_closed');
    default:
      return t('auth.register.messages.register_failed');
  }
};

const handleRegister = async () => {
  if (!process.client || !validateForm()) return;
  isLoading.value = true;

  try {
    const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
    const { auth } = await import('~/utils/auth/firebase.js');

    const credential = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    await updateProfile(credential.user, {
      displayName: fullName.value.trim(),
    });

    await sendEmailVerification(credential.user);

    toast.success(t('auth.register.messages.verify_email_sent'), { timeout: 8000 });

    await auth.signOut();

    isSuccess.value = true;

  } catch (error) {
    console.error('Register failed:', error);
    toast.error(getRegisterErrorMessage(error));
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleRegister = async () => {
  if (!process.client) return;
  isLoading.value = true;

  try {
    const { signInWithPopup } = await import('firebase/auth');
    const { auth, provider } = await import('~/utils/auth/firebase.js');

    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    await handleBackendAuth(idToken, true, 'partner');
  } catch (error) {
    console.error('Google register failed:', error);
    toast.error(getRegisterErrorMessage(error));
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Register - Orbit AI',
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
