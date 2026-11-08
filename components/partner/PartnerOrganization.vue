<template>
  <div class="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div v-if="loading" class="py-20 text-center flex flex-col items-center gap-4">
      <div class="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 dark:text-white/20 text-xs font-bold uppercase tracking-[0.2em]">{{ $t('partner.organization.syncing') }}</p>
    </div>

    <template v-else>
      <div class="flex items-end justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">{{ $t('partner.organization.title') }}</h1>
          <p class="text-slate-500 dark:text-white/40 text-sm mt-1 transition-colors">{{ $t('partner.organization.subtitle') }}</p>
        </div>
        <button @click="$emit('edit')" class="luminous-btn px-6 py-2.5 rounded-xl text-[10px] font-bold text-white dark:text-black uppercase tracking-widest flex items-center gap-2 shadow-lg dark:shadow-none">
          <span class="material-symbols-outlined text-sm">edit_note</span>
          {{ orgData ? $t('partner.organization.update_registry') : $t('partner.organization.init_registry') }}
        </button>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div class="glass-card rounded-2xl p-8 flex flex-col items-center text-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-10 dark:opacity-20 animate-pulse"></div>
              <img v-if="profile?.photoURL" :src="profile.photoURL" class="w-32 h-32 rounded-full object-cover relative z-10 border-2 border-purple-500/30 shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.2)]" alt="Org Logo" />
              <div v-else class="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-4xl font-bold text-slate-900 dark:text-white relative z-10 transition-colors">O</div>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] leading-tight mb-2 transition-colors">{{ orgData?.name || $t('partner.organization.pending_org') }}</h2>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-6 transition-colors" :class="orgData?.status === 'active' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-white/20'">
              <span class="w-1.5 h-1.5 rounded-full" :class="orgData?.status === 'active' ? 'bg-cyan-600 dark:bg-cyan-400' : 'bg-slate-300 dark:bg-white/20'"></span>
              {{ orgData?.status || $t('partner.organization.unregistered') }} {{ $t('partner.organization.entity') }}
            </p>
          </div>
          <div class="glass-card rounded-2xl p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-md dark:shadow-none transition-colors">
            <h3 class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-white/10 pb-2 font-bold transition-colors">{{ $t('partner.organization.registry_timeline') }}</h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-lg transition-colors">event_available</span>
                <div class="text-left">
                  <p class="text-[9px] text-slate-400 dark:text-white/30 uppercase font-bold tracking-widest transition-colors">{{ $t('partner.organization.established') }}</p>
                  <p class="text-xs text-slate-700 dark:text-white transition-colors">{{ orgData?.created_at ? new Date(orgData.created_at).toLocaleDateString() : $t('partner.organization.awaiting_init') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Detailed Parameters -->
        <div class="col-span-12 lg:col-span-8 space-y-8">
          <div class="glass-card rounded-2xl p-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="field in [
                { label: $t('partner.organization.legal_name'), value: orgData?.name },
                { label: $t('partner.organization.official_email'), value: orgData?.email },
                { label: $t('partner.organization.phone'), value: orgData?.phone },
                { label: $t('partner.organization.compliance_status'), value: orgData?.status }
              ]" :key="field.label" class="flex flex-col gap-2">
                <label class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold transition-colors">{{ field.label }}</label>
                <div class="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-700 dark:text-white/80 font-medium transition-colors">{{ field.value || $t('partner.organization.not_found') }}</div>
              </div>
              <div class="md:col-span-2 flex flex-col gap-2">
                <label class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold transition-colors">{{ $t('partner.organization.mission_desc') }}</label>
                <div class="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-600 dark:text-white/60 leading-relaxed min-h-[100px] transition-colors">{{ orgData?.description || $t('partner.organization.no_org_data') }}</div>
              </div>
              <div class="md:col-span-2 flex flex-col gap-2">
                <label class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold transition-colors">{{ $t('partner.organization.physical_coords') }}</label>
                <div class="bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm text-slate-600 dark:text-white/60 transition-colors">{{ orgData?.address || $t('partner.organization.geo_pending') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  orgData: Object,
  profile: Object,
  loading: Boolean
})
defineEmits(['edit'])
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}
</style>
