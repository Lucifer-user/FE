<template>
  <section id="solutions" class="relative overflow-hidden border-b border-slate-200/80 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 dark:border-white/10 dark:bg-transparent">
    <div class="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.025]" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 52px 52px; background-position: center center;"></div>
    <div class="pointer-events-none absolute -left-48 top-48 h-[28rem] w-[28rem] rounded-full bg-cyan-200/20 blur-[130px] dark:bg-cyan-500/10"></div>
    <div class="pointer-events-none absolute -right-48 bottom-24 h-[32rem] w-[32rem] rounded-full bg-blue-200/20 blur-[150px] dark:bg-blue-500/10"></div>

    <div class="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div class="max-w-3xl">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.eyebrow }}</p>
        <h2 class="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">{{ copy.title }}</h2>
        <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.description }}</p>
      </div>

      <div class="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(solution, index) in copy.solutions" :key="solution.title" class="solution-card group">
          <div class="flex items-start justify-between gap-4">
            <div class="solution-card__icon-wrap">
              <span class="material-symbols-outlined solution-card__icon">{{ solution.icon }}</span>
            </div>
            <span class="solution-card__index">0{{ index + 1 }}</span>
          </div>
          <div class="mt-12">
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{{ solution.label }}</p>
            <h3 class="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{{ solution.title }}</h3>
            <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300/65">{{ solution.description }}</p>
          </div>
        </article>
      </div>

      <div class="mt-24 border-t border-slate-200/80 pt-20 dark:border-white/10 sm:mt-28 sm:pt-24">
        <div class="max-w-3xl">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.workflowEyebrow }}</p>
          <h3 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-4xl dark:text-white">{{ copy.workflowTitle }}</h3>
          <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.workflowDescription }}</p>
        </div>

        <div class="workflow mt-12">
          <div class="workflow__line workflow__line--desktop" aria-hidden="true"></div>
          <div class="workflow__line workflow__line--mobile" aria-hidden="true"></div>

          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            <article v-for="step in copy.workflow" :key="step.number" class="workflow-step">
              <div class="workflow-step__top">
                <div class="workflow-step__number">{{ step.number }}</div>
                <span class="material-symbols-outlined workflow-step__icon">{{ step.icon }}</span>
              </div>
              <div class="workflow-step__content">
                <h4 class="text-base font-semibold text-slate-950 dark:text-white">{{ step.title }}</h4>
                <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300/65">{{ step.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="mt-20 flex flex-col gap-6 rounded-2xl border border-cyan-200/80 bg-white/65 px-6 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-cyan-300/15 dark:bg-[#0A0A0A]/75 dark:shadow-none">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{{ copy.ctaEyebrow }}</p>
          <h3 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{{ copy.ctaTitle }}</h3>
        </div>
        <NuxtLink to="/partner" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white no-underline transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-[0_14px_30px_rgba(8,145,178,0.18)] dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
          {{ copy.ctaButton }}
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </NuxtLink>
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
      eyebrow: 'SOLUTIONS',
      title: 'Giải pháp AI cho doanh nghiệp hiện đại',
      description: 'Orbit AI giúp doanh nghiệp triển khai trợ lý AI, quản lý tổ chức, kiểm soát tài nguyên sử dụng và vận hành dịch vụ AI tập trung.',
      solutions: [
        { label: 'AI ASSISTANTS', icon: 'smart_toy', title: 'Trợ lý AI', description: 'Triển khai và quản lý trợ lý AI hỗ trợ người dùng doanh nghiệp trên một nền tảng thống nhất.' },
        { label: 'ORGANIZATION MANAGEMENT', icon: 'account_tree', title: 'Quản lý tổ chức', description: 'Quản lý doanh nghiệp, người dùng, vai trò và quyền truy cập tập trung.' },
        { label: 'TOKEN MANAGEMENT', icon: 'data_usage', title: 'Quản lý Token', description: 'Theo dõi mức sử dụng token, hạn mức và tài nguyên AI của từng tổ chức.' },
        { label: 'BILLING & PLANS', icon: 'receipt_long', title: 'Billing & Gói dịch vụ', description: 'Quản lý gói dịch vụ và tài nguyên phù hợp với quy mô sử dụng của doanh nghiệp.' },
      ],
      workflowEyebrow: 'WORKFLOW',
      workflowTitle: 'Doanh nghiệp bắt đầu với Orbit AI như thế nào?',
      workflowDescription: 'Quy trình triển khai từ tổ chức đến vận hành trợ lý AI.',
      workflow: [
        { number: '01', icon: 'corporate_fare', title: 'Tạo tổ chức', description: 'Khởi tạo không gian làm việc cho doanh nghiệp.' },
        { number: '02', icon: 'inventory_2', title: 'Chọn gói dịch vụ', description: 'Lựa chọn gói phù hợp với nhu cầu sử dụng.' },
        { number: '03', icon: 'rocket_launch', title: 'Triển khai trợ lý AI', description: 'Kích hoạt các trợ lý hoặc dịch vụ AI cần thiết.' },
        { number: '04', icon: 'admin_panel_settings', title: 'Quản lý người dùng & quyền', description: 'Phân quyền người dùng trong tổ chức.' },
        { number: '05', icon: 'monitoring', title: 'Theo dõi Token', description: 'Giám sát mức sử dụng và hạn mức tài nguyên AI.' },
      ],
      ctaEyebrow: 'ORBIT FOR ENTERPRISE',
      ctaTitle: 'Triển khai giải pháp cho doanh nghiệp',
      ctaButton: 'Triển khai giải pháp',
    }
  : {
      eyebrow: 'SOLUTIONS',
      title: 'AI solutions for the modern enterprise',
      description: 'Orbit AI helps enterprises deploy AI assistants, manage organizations, control usage resources, and operate AI services from one central platform.',
      solutions: [
        { label: 'AI ASSISTANTS', icon: 'smart_toy', title: 'AI Assistants', description: 'Deploy and manage AI assistants for enterprise users on one unified platform.' },
        { label: 'ORGANIZATION MANAGEMENT', icon: 'account_tree', title: 'Organization management', description: 'Centralize enterprise users, roles, and access permissions.' },
        { label: 'TOKEN MANAGEMENT', icon: 'data_usage', title: 'Token management', description: 'Track token usage, quotas, and AI resources for every organization.' },
        { label: 'BILLING & PLANS', icon: 'receipt_long', title: 'Billing & plans', description: 'Manage service plans and resources around enterprise usage needs.' },
      ],
      workflowEyebrow: 'WORKFLOW',
      workflowTitle: 'How does an enterprise get started with Orbit AI?',
      workflowDescription: 'A clear path from organization setup to AI assistant operations.',
      workflow: [
        { number: '01', icon: 'corporate_fare', title: 'Create organization', description: 'Set up the enterprise workspace.' },
        { number: '02', icon: 'inventory_2', title: 'Choose a service plan', description: 'Select a plan for your usage needs.' },
        { number: '03', icon: 'rocket_launch', title: 'Deploy AI assistants', description: 'Activate the assistants or services you need.' },
        { number: '04', icon: 'admin_panel_settings', title: 'Manage users & access', description: 'Assign permissions across the organization.' },
        { number: '05', icon: 'monitoring', title: 'Monitor tokens', description: 'Track usage and AI resource quotas.' },
      ],
      ctaEyebrow: 'ORBIT FOR ENTERPRISE',
      ctaTitle: 'Deploy an enterprise-ready solution',
      ctaButton: 'Deploy solution',
    })
</script>

<style scoped>
.solution-card {
  @apply flex min-h-[300px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition duration-300 dark:border-cyan-300/15 dark:bg-[#0A0A0A] dark:shadow-none;
}

.solution-card:hover {
  @apply -translate-y-1 border-cyan-300 shadow-[0_18px_34px_rgba(8,145,178,0.12)] dark:border-cyan-300/35 dark:shadow-[0_18px_38px_rgba(6,182,212,0.08)];
}

.solution-card__icon-wrap {
  @apply flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 transition duration-300 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300;
}

.solution-card:hover .solution-card__icon-wrap {
  @apply border-cyan-300 bg-cyan-100 dark:border-cyan-300/40 dark:bg-cyan-300/15;
}

.solution-card__icon {
  @apply text-[23px];
}

.solution-card__index {
  @apply rounded border border-slate-200 px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-slate-400 dark:border-white/10 dark:text-slate-500;
}

.workflow {
  @apply relative;
}

.workflow__line {
  @apply pointer-events-none absolute bg-cyan-200 dark:bg-cyan-300/20;
}

.workflow__line--desktop {
  @apply left-[10%] right-[10%] top-6 hidden h-px lg:block;
}

.workflow__line--mobile {
  @apply bottom-8 left-[1.25rem] top-8 w-px sm:hidden;
}

.workflow-step {
  @apply relative z-10 grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 lg:block;
}

.workflow-step__top {
  @apply flex items-start gap-3 lg:flex-col lg:items-start lg:gap-4;
}

.workflow-step__number {
  @apply flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300 bg-white text-xs font-bold tracking-widest text-cyan-700 shadow-sm dark:border-cyan-300/40 dark:bg-[#050505] dark:text-cyan-300;
}

.workflow-step__icon {
  @apply mt-2 text-[20px] text-cyan-700 dark:text-cyan-300 lg:ml-1 lg:mt-0;
}

.workflow-step__content {
  @apply min-w-0 pt-0 lg:mt-5;
}

@media (prefers-reduced-motion: reduce) {
  .solution-card,
  .solution-card__icon-wrap {
    transition: none;
  }
}
</style>
