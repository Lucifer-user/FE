<template>
  <section id="enterprise" class="relative overflow-hidden border-b border-slate-200/80 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 dark:border-white/10 dark:bg-transparent">
    <div class="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.025]" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 52px 52px; background-position: center center;"></div>
    <div class="pointer-events-none absolute -right-40 top-28 h-[30rem] w-[30rem] rounded-full bg-cyan-200/15 blur-[100px] dark:bg-cyan-500/10"></div>
    <div class="pointer-events-none absolute -left-48 bottom-8 h-[26rem] w-[26rem] rounded-full bg-blue-200/15 blur-[100px] dark:bg-blue-500/10"></div>

    <div class="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div class="grid items-center gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(520px,1.18fr)] lg:gap-16">
        <div class="max-w-xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.eyebrow }}</p>
          <h2 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">{{ copy.title }}</h2>
          <p class="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.description }}</p>

          <div class="mt-9 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
            <div v-for="capability in copy.capabilities" :key="capability.title" class="group flex gap-4 py-4">
              <span class="capability-icon"><span class="material-symbols-outlined text-[19px]">{{ capability.icon }}</span></span>
              <div>
                <h3 class="text-sm font-semibold text-slate-950 dark:text-white">{{ capability.title }}</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ capability.description }}</p>
              </div>
            </div>
          </div>

          <a href="mailto:enterprise@orbit.ai" class="mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-[0_14px_30px_rgba(8,145,178,0.18)] dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
            {{ copy.cta }}
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>

        <div class="relative min-w-0 lg:min-h-[570px]">
          <div class="enterprise-orbit pointer-events-none absolute inset-[-7%] z-0" aria-hidden="true">
            <svg viewBox="0 0 720 620" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="enterprise-orbit-gradient" x1="90" y1="100" x2="640" y2="510" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#22D3EE" stop-opacity="0.08" />
                  <stop offset="0.5" stop-color="#06B6D4" stop-opacity="0.72" />
                  <stop offset="1" stop-color="#3B82F6" stop-opacity="0.08" />
                </linearGradient>
              </defs>
              <ellipse cx="360" cy="308" rx="310" ry="164" stroke="url(#enterprise-orbit-gradient)" stroke-width="1.25" transform="rotate(-17 360 308)" class="enterprise-orbit__ring" />
              <ellipse cx="360" cy="308" rx="258" ry="120" stroke="url(#enterprise-orbit-gradient)" stroke-width="1" transform="rotate(25 360 308)" class="enterprise-orbit__ring enterprise-orbit__ring--inner" />
              <circle cx="83" cy="230" r="4" fill="#22D3EE" class="enterprise-orbit__node" />
              <circle cx="620" cy="385" r="4" fill="#3B82F6" class="enterprise-orbit__node enterprise-orbit__node--delay" />
            </svg>
          </div>

          <div class="enterprise-dashboard relative z-10 mx-auto w-full max-w-[650px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-4 dark:border-cyan-300/15 dark:bg-[#0A0A0A]/95 dark:shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-white/10 dark:bg-[#050505]">
              <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
                <div class="flex min-w-0 items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300"><span class="material-symbols-outlined text-[21px]">domain</span></div>
                  <div class="min-w-0">
                    <p class="truncate text-xs font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">Orbit Enterprise</p>
                    <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ copy.dashboardSubtitle }}</p>
                  </div>
                </div>
                <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-300/10 dark:text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Active</span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="enterprise-metric">
                  <span class="material-symbols-outlined enterprise-metric__icon">smart_toy</span>
                  <span class="enterprise-metric__label">{{ copy.metrics.assistants }}</span>
                  <strong class="enterprise-metric__value">12</strong>
                </div>
                <div class="enterprise-metric">
                  <span class="material-symbols-outlined enterprise-metric__icon">group</span>
                  <span class="enterprise-metric__label">{{ copy.metrics.users }}</span>
                  <strong class="enterprise-metric__value">48</strong>
                </div>
                <div class="enterprise-metric">
                  <span class="material-symbols-outlined enterprise-metric__icon">data_usage</span>
                  <span class="enterprise-metric__label">{{ copy.metrics.tokenUsage }}</span>
                  <strong class="enterprise-metric__value">684,250</strong>
                </div>
                <div class="enterprise-metric">
                  <span class="material-symbols-outlined enterprise-metric__icon">workspace_premium</span>
                  <span class="enterprise-metric__label">{{ copy.metrics.plan }}</span>
                  <strong class="enterprise-metric__value">Pro</strong>
                </div>
              </div>

              <div class="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ copy.usageTitle }}</p>
                      <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ copy.usageSubtitle }}</p>
                    </div>
                    <span class="text-sm font-bold text-cyan-700 dark:text-cyan-300">68%</span>
                  </div>
                  <div class="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/70"><div class="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div></div>
                  <div class="mt-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400"><span>684,250 used</span><span>1,000,000 limit</span></div>
                  <svg viewBox="0 0 300 72" class="mt-5 h-16 w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Token usage trend">
                    <path d="M2 59C20 56 25 44 44 46C62 48 69 53 87 42C105 31 112 39 130 34C148 29 155 41 173 32C191 23 199 27 217 22C235 17 244 27 260 16C275 6 284 12 298 5" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round" />
                    <path d="M2 59C20 56 25 44 44 46C62 48 69 53 87 42C105 31 112 39 130 34C148 29 155 41 173 32C191 23 199 27 217 22C235 17 244 27 260 16C275 6 284 12 298 5V72H2V59Z" fill="url(#enterprise-chart-fill)" fill-opacity="0.12" />
                    <defs><linearGradient id="enterprise-chart-fill" x1="150" y1="0" x2="150" y2="72" gradientUnits="userSpaceOnUse"><stop stop-color="#22D3EE" /><stop offset="1" stop-color="#22D3EE" stop-opacity="0" /></linearGradient></defs>
                  </svg>
                </div>

                <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ copy.servicesTitle }}</p>
                    <span class="material-symbols-outlined text-[18px] text-cyan-700 dark:text-cyan-300">hub</span>
                  </div>
                  <div class="mt-5 space-y-3">
                    <div v-for="service in copy.services" :key="service.name" class="flex items-center justify-between gap-2 text-[11px]"><span class="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300"><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span><span class="truncate">{{ service.name }}</span></span><span class="shrink-0 font-semibold text-slate-400 dark:text-slate-500">{{ service.value }}</span></div>
                  </div>
                  <div class="mt-5 border-t border-slate-100 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:border-white/10 dark:text-cyan-300">{{ copy.workspaceStatus }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const copy = computed(() => locale.value === 'vi'
  ? {
      eyebrow: 'ENTERPRISE',
      title: 'Được xây dựng cho vận hành AI trong doanh nghiệp',
      description: 'Orbit AI giúp doanh nghiệp quản lý trợ lý AI, người dùng, quyền truy cập và tài nguyên sử dụng trên một hệ thống tập trung.',
      cta: 'Liên hệ doanh nghiệp',
      dashboardSubtitle: 'Organization control center',
      usageTitle: 'Token usage',
      usageSubtitle: 'Monthly organization quota',
      servicesTitle: 'AI Services',
      workspaceStatus: 'Workspace operating normally',
      metrics: { assistants: 'AI Assistants', users: 'Users', tokenUsage: 'Token Usage', plan: 'Current Plan' },
      services: [
        { name: 'Customer Support Assistant', value: 'Live' },
        { name: 'Internal Knowledge Assistant', value: 'Live' },
        { name: 'Operations Assistant', value: 'Ready' },
      ],
      capabilities: [
        { icon: 'corporate_fare', title: 'Quản lý tổ chức', description: 'Quản lý không gian làm việc và cấu hình doanh nghiệp.' },
        { icon: 'admin_panel_settings', title: 'Người dùng & phân quyền', description: 'Kiểm soát người dùng, vai trò và quyền truy cập.' },
        { icon: 'smart_toy', title: 'Trợ lý AI', description: 'Quản lý các trợ lý AI đang được triển khai.' },
        { icon: 'data_usage', title: 'Token & quota', description: 'Theo dõi mức sử dụng và hạn mức tài nguyên.' },
        { icon: 'receipt_long', title: 'Billing tập trung', description: 'Quản lý gói dịch vụ theo tổ chức.' },
      ],
    }
  : {
      eyebrow: 'ENTERPRISE',
      title: 'Built for enterprise AI operations',
      description: 'Orbit AI helps enterprises manage AI assistants, users, access permissions, and usage resources from one centralized system.',
      cta: 'Contact enterprise team',
      dashboardSubtitle: 'Organization control center',
      usageTitle: 'Token usage',
      usageSubtitle: 'Monthly organization quota',
      servicesTitle: 'AI Services',
      workspaceStatus: 'Workspace operating normally',
      metrics: { assistants: 'AI Assistants', users: 'Users', tokenUsage: 'Token Usage', plan: 'Current Plan' },
      services: [
        { name: 'Customer Support Assistant', value: 'Live' },
        { name: 'Internal Knowledge Assistant', value: 'Live' },
        { name: 'Operations Assistant', value: 'Ready' },
      ],
      capabilities: [
        { icon: 'corporate_fare', title: 'Organization management', description: 'Manage enterprise workspaces and configuration.' },
        { icon: 'admin_panel_settings', title: 'Users & permissions', description: 'Control users, roles, and access permissions.' },
        { icon: 'smart_toy', title: 'AI assistants', description: 'Manage assistants deployed across the organization.' },
        { icon: 'data_usage', title: 'Token & quota', description: 'Monitor usage levels and resource limits.' },
        { icon: 'receipt_long', title: 'Centralized billing', description: 'Manage service plans by organization.' },
      ],
    })
</script>

<style scoped>
.capability-icon {
  @apply flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300;
}

.enterprise-dashboard {
  transform: perspective(1200px) rotateY(-5deg) rotateX(2deg);
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 700ms ease;
}

.enterprise-dashboard:hover {
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(-4px);
}

.enterprise-metric {
  @apply flex min-h-[108px] flex-col rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.035];
}

.enterprise-metric__icon {
  @apply text-[17px] text-cyan-700 dark:text-cyan-300;
}

.enterprise-metric__label {
  @apply mt-3 text-[10px] font-medium leading-4 text-slate-500 dark:text-slate-400;
}

.enterprise-metric__value {
  @apply mt-auto text-lg font-semibold tracking-tight text-slate-950 dark:text-white;
}

.enterprise-orbit__ring {
  transform-origin: center;
  animation: enterprise-orbit-drift 20s ease-in-out infinite alternate;
}

.enterprise-orbit__ring--inner {
  animation-duration: 26s;
  animation-direction: alternate-reverse;
}

.enterprise-orbit__node {
  animation: enterprise-orbit-pulse 4s ease-in-out infinite;
}

.enterprise-orbit__node--delay {
  animation-delay: -2s;
}

@keyframes enterprise-orbit-drift {
  0% { transform: rotate(-1deg) scale(0.98); opacity: 0.62; }
  100% { transform: rotate(3deg) scale(1.02); opacity: 1; }
}

@keyframes enterprise-orbit-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.12); }
}

@media (max-width: 1023px) {
  .enterprise-dashboard {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .enterprise-dashboard,
  .enterprise-orbit__ring,
  .enterprise-orbit__node {
    animation: none;
    transition: none;
    transform: none;
  }
}
</style>
