<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black px-4 py-8">
    <div class="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

      <div class="relative z-10">
        <div class="text-center mb-8">
          <div class="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-inner">
            <KeyIcon class="w-8 h-8 text-cyan-300" />
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{{ $t('auth.forgot_password.title') }}</h2>
          <p class="text-gray-300 mt-2 text-sm">{{ $t('auth.forgot_password.subtitle') }}</p>
        </div>

        <form @submit.prevent="handleForgot" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">{{ $t('auth.forgot_password.email_label') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="email" type="email" class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl leading-5 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition duration-150 ease-in-out" :placeholder="$t('auth.forgot_password.email_placeholder')" />
            </div>
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 shadow-lg transform transition hover:-translate-y-0.5 duration-150 relative overflow-hidden group">
              <span class="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span class="relative">{{ $t('auth.forgot_password.btn_submit') }}</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-300">
          {{ $t('auth.forgot_password.back_to') }}
          <a href="#" @click.prevent="goLogin" class="font-medium text-cyan-400 hover:text-cyan-300 transition ease-in-out duration-150">
            {{ $t('auth.forgot_password.login') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EnvelopeIcon, KeyIcon } from '@heroicons/vue/24/outline';

const toast = useToast();
const { t } = useI18n();

const email = ref('');
const router = useRouter();

const handleForgot = async () => {
  if (!email.value) {
    toast.warning(t('auth.forgot_password.messages.email_required'));
    return;
  }

  try {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    const { auth } = await import('~/utils/auth/firebase.js');

    await sendPasswordResetEmail(auth, email.value.trim());

    toast.success(t('auth.forgot_password.messages.success'), { timeout: 8000 });
    
    setTimeout(() => {
      router.push("/login");
    }, 3000);

  } catch (error) {
    console.error("Forgot password error:", error);
    if (error.code === 'auth/user-not-found') {
      toast.error(t('auth.forgot_password.messages.user_not_found'));
    } else if (error.code === 'auth/invalid-email') {
      toast.error(t('auth.forgot_password.messages.invalid_email'));
    } else {
      toast.error(t('auth.forgot_password.messages.error'));
    }
  }
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
