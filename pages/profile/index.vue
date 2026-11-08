<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-white font-['Inter'] relative overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-500">
    <div class="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-20" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 50px 50px;"></div>
    
    <!-- MAIN PROFILE CONTENT -->
    <main class="max-w-[1400px] mx-auto px-12 pt-32 pb-20 grid grid-cols-12 gap-8 relative z-10">
      
      <!-- LEFT SECTION -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <div class="glass-card rounded-[2rem] p-10 flex flex-col items-center text-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
          <div class="relative mb-8">
            <div class="absolute inset-0 bg-indigo-500 dark:bg-cyan-500 rounded-full blur-3xl opacity-10 dark:opacity-20"></div>
            <div class="w-40 h-40 rounded-full p-1.5 border-2 border-slate-200 dark:border-cyan-500/20 relative">
              <img :src="user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'" class="w-full h-full rounded-full object-cover relative z-10" alt="Avatar" />
              <button @click="openEditModal" class="absolute bottom-2 right-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/20 rounded-full p-2 hover:bg-indigo-50 dark:hover:bg-cyan-500/20 hover:border-indigo-400 dark:hover:border-cyan-400 transition-all z-20 shadow-lg">
                <span class="material-symbols-outlined text-slate-600 dark:text-white text-sm">edit</span>
              </button>
            </div>
          </div>
          
          <h1 class="text-4xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">{{ user?.displayName || 'Elara Vance' }}</h1>
          <p class="text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-10 transition-colors">
            <span class="material-symbols-outlined text-[18px]">verified</span> 
            {{ $t('profile.index.operator_level') }}
          </p>

          <div class="w-full grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-8">
            <div class="flex flex-col items-center border-r border-slate-100 dark:border-white/5">
              <span class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-2 font-bold transition-colors">{{ $t('profile.index.compute_hours') }}</span>
              <span class="text-3xl font-bold text-indigo-600 dark:text-cyan-400 font-['Space_Grotesk'] tracking-tighter transition-colors">1,420</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-2 font-bold transition-colors">{{ $t('profile.index.syntheses') }}</span>
              <span class="text-3xl font-bold text-purple-600 dark:text-purple-400 font-['Space_Grotesk'] tracking-tighter transition-colors">89</span>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-[2rem] p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors">
          <h2 class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-8 border-b border-slate-100 dark:border-white/5 pb-4 font-bold transition-colors">{{ $t('profile.index.linked_arrays') }}</h2>
          <div class="space-y-4">
            <div v-for="link in links" :key="link.name" class="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer">
              <div class="flex items-center gap-4">
                <span class="material-symbols-outlined text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white">{{ link.icon }}</span>
                <span class="text-xs font-bold text-slate-700 dark:text-white/80 transition-colors">{{ link.name }}</span>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-widest transition-colors" :class="link.status === $t('profile.index.connected') ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-300 dark:text-white/20'">{{ link.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SECTION -->
      <div class="col-span-12 lg:col-span-8 flex flex-col gap-8">
        <div class="glass-card rounded-[2rem] p-12 flex-grow bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors">
          <div class="flex items-center justify-between mb-12 border-b border-slate-100 dark:border-white/5 pb-8">
            <div>
              <h2 class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ $t('profile.index.core_parameters') }}</h2>
              <p class="text-sm text-slate-500 dark:text-white/40 mt-1 transition-colors">{{ $t('profile.index.core_parameters_desc') }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div class="flex flex-col gap-3">
              <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] font-bold transition-colors">{{ $t('profile.index.first_name') }}</label>
              <input v-model="profileForm.firstName" type="text" class="bg-slate-50 dark:bg-[#0c121d] border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500/50 dark:focus:border-cyan-500/50 outline-none transition-all" placeholder="Elara" />
            </div>
            <div class="flex flex-col gap-3">
              <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] font-bold transition-colors">{{ $t('profile.index.last_name') }}</label>
              <input v-model="profileForm.lastName" type="text" class="bg-slate-50 dark:bg-[#0c121d] border border-slate-200 dark:border-white/10 rounded-xl px-6 py-4 text-slate-900 dark:text-white focus:border-indigo-500/50 dark:focus:border-cyan-500/50 outline-none transition-all" placeholder="Vance" />
            </div>
            <div class="flex flex-col gap-3 md:col-span-2">
              <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] font-bold transition-colors">{{ $t('profile.index.email_address') }}</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/20 transition-colors">mail</span>
                <input v-model="profileForm.email" type="email" readonly class="w-full bg-slate-50/50 dark:bg-[#0c121d]/50 border border-slate-200 dark:border-white/10 rounded-xl pl-14 pr-6 py-4 text-slate-500 dark:text-white/50 focus:border-indigo-500/50 dark:focus:border-cyan-500/50 outline-none transition-all cursor-not-allowed" placeholder="elara.vance@orbit.net" />
              </div>
            </div>
            
            <div class="md:col-span-2 flex justify-end mt-4">
              <button @click="saveProfile" class="luminous-btn px-10 py-4 rounded-xl text-[10px] font-bold text-white dark:text-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg dark:shadow-none">
                <span class="material-symbols-outlined text-[18px]">save</span>
                {{ $t('profile.index.save_changes') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Grid: Security & Action -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Security Protocols -->
          <div class="glass-card rounded-[2rem] p-10 flex flex-col justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors">
            <h3 class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-10 font-bold flex items-center gap-3 transition-colors">
              <span class="material-symbols-outlined text-slate-400 dark:text-white/40 text-lg">verified_user</span> {{ $t('profile.index.security_protocols') }}
            </h3>
            <div class="space-y-8">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{{ $t('profile.index.mfa') }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-white/30 mt-1 uppercase font-bold tracking-widest transition-colors">{{ $t('profile.index.mfa_desc') }}</p>
                </div>
                <div @click="profileForm.mfa = !profileForm.mfa" class="w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 border border-slate-200 dark:border-white/10" :class="profileForm.mfa ? 'bg-indigo-500/20 dark:bg-cyan-500/20 border-indigo-500/40 dark:border-cyan-500/40' : 'bg-slate-100 dark:bg-white/5'">
                  <div class="absolute top-1 w-4 h-4 rounded-full transition-all duration-300" :class="profileForm.mfa ? 'right-1 bg-indigo-600 dark:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,1)]' : 'left-1 bg-slate-300 dark:bg-white/20'"></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{{ $t('profile.index.data_telemetry') }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-white/30 mt-1 uppercase font-bold tracking-widest transition-colors">{{ $t('profile.index.data_telemetry_desc') }}</p>
                </div>
                <div @click="profileForm.telemetry = !profileForm.telemetry" class="w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 border border-slate-200 dark:border-white/10" :class="profileForm.telemetry ? 'bg-indigo-500/20 dark:bg-cyan-500/20 border-indigo-500/40 dark:border-cyan-500/40' : 'bg-slate-100 dark:bg-white/5'">
                  <div class="absolute top-1 w-4 h-4 rounded-full transition-all duration-300" :class="profileForm.telemetry ? 'right-1 bg-indigo-600 dark:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,1)]' : 'left-1 bg-slate-300 dark:bg-white/20'"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Latest Action -->
          <div class="glass-card rounded-[2rem] p-10 flex flex-col justify-between bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 transition-colors">
            <div>
              <h3 class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-8 font-bold flex items-center gap-3 transition-colors">
                <span class="material-symbols-outlined text-slate-400 dark:text-white/40 text-lg transition-colors">history</span> {{ $t('profile.index.latest_action') }}
              </h3>
              <p class="text-sm font-bold text-slate-900 dark:text-white leading-tight transition-colors">{{ $t('profile.index.latest_action_desc') }}</p>
              <p class="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mt-2 transition-colors">{{ $t('profile.index.time_ago') }}</p>
            </div>
            
            <div class="mt-12">
              <div class="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/5 transition-colors">
                <div class="bg-gradient-to-r from-indigo-500 dark:from-cyan-400 to-purple-500 h-full w-[75%] relative shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                  <div class="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-[2px] animate-pulse"></div>
                </div>
              </div>
              <div class="flex justify-end mt-3">
                 <p class="text-[9px] text-slate-400 dark:text-white/20 uppercase font-bold tracking-[0.2em] transition-colors">{{ $t('profile.index.scan_status') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Mockup -->
    <footer class="w-full py-12 px-12 border-t border-slate-100 dark:border-white/5 text-center flex flex-col items-center gap-6 transition-colors">
       <div class="flex gap-8 text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] transition-colors">
          <a href="#" class="hover:text-slate-600 dark:hover:text-white/40 transition-colors">{{ $t('profile.index.footer.privacy') }}</a>
          <a href="#" class="hover:text-slate-600 dark:hover:text-white/40 transition-colors">{{ $t('profile.index.footer.node_status') }}</a>
          <a href="#" class="hover:text-slate-600 dark:hover:text-white/40 transition-colors">{{ $t('profile.index.footer.api_docs') }}</a>
       </div>
       <p class="text-[9px] text-slate-300 dark:text-white/20 uppercase tracking-[0.2em] font-medium transition-colors">{{ $t('profile.index.footer.copyright') }} <span class="text-slate-400 dark:text-white/40">Orbit AI</span></p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const { t } = useI18n();
const toast = useToast();
const user = ref(null);
const profileForm = ref({
  firstName: "Elara",
  lastName: "Vance",
  email: "elara.vance@orbit.net",
  bio: "Navigating the intersection of synthetic intelligence and human creativity. Primary focus on generative topology and neural pathing.",
  mfa: true,
  telemetry: false
});

const links = computed(() => [
  { name: 'Global Network (Google)', status: t('profile.index.connected'), icon: 'public' },
  { name: 'Social Matrix (Meta)', status: t('profile.index.unlinked'), icon: 'hub' }
]);

const saveProfile = async () => {
  try {
    const config = useRuntimeConfig();
    const token = useCookie('accessToken');
    const newName = `${profileForm.value.firstName} ${profileForm.value.lastName}`.trim();

    const response = await $fetch(`${config.public.apiBase}/auth/profile`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { name: newName }
    });

    if (response && response.status === 'success') {
      const authUser = useCookie('orbit_ai_user');
      if (authUser.value) {
        authUser.value.name = newName;
      }
      user.value.displayName = newName;
      toast.success(response.message || 'Đã lưu thay đổi hồ sơ.');
    }
  } catch (error) {
    console.error("Save failed:", error);
    toast.error(error.response?._data?.message || 'Không thể lưu thay đổi.');
  }
};

const setupAuthListener = async () => {
  const authUser = useCookie('orbit_ai_user')
  if (!authUser.value) {
    return navigateTo('/Login')
  }

  user.value = {
    displayName: authUser.value.name || authUser.value.email || 'Orbit User',
    email: authUser.value.email || '',
    photoURL: authUser.value.photoURL || ''
  }

  profileForm.value.email = user.value.email || profileForm.value.email
  const names = user.value.displayName?.split(' ') || []
  profileForm.value.firstName = names[0] || profileForm.value.firstName
  profileForm.value.lastName = names.slice(1).join(' ') || profileForm.value.lastName
};

onMounted(async () => {
  await setupAuthListener();
});
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.luminous-btn {
  background: linear-gradient(90deg, #4f46e5, #9333ea);
}
.dark .luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
}

.luminous-btn {
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.dark .luminous-btn {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.3);
}

.luminous-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.dark .luminous-btn:hover {
  box-shadow: 0 0 50px rgba(0, 240, 255, 0.5);
}

input, textarea {
  transition: all 0.3s ease;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.2); }
</style>
