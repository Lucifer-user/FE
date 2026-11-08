<template>
  <div class="relative min-h-screen overflow-x-hidden bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 selection:bg-cyan-500/20 selection:text-slate-950 dark:selection:text-white">
    <div
      class="pointer-events-none fixed inset-0 z-0 opacity-[0.045] dark:opacity-[0.035]"
      style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 52px 52px; background-position: center center;"
    ></div>
    <div class="pointer-events-none fixed left-1/2 top-0 z-0 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-cyan-200/25 blur-[140px] dark:bg-cyan-500/10"></div>
    
    <!-- Meteor Shower Background (Dark mode only) -->
    <div class="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block">
      <div class="meteor-wrapper" style="top: -10%; left: 30%;"><div class="meteor" style="animation-delay: 1.2s; animation-duration: 4.5s;"></div></div>
      <div class="meteor-wrapper" style="top: 25%; left: 70%;"><div class="meteor" style="animation-delay: 4.5s; animation-duration: 3.8s;"></div></div>
      <div class="meteor-wrapper" style="top: 60%; left: 15%;"><div class="meteor" style="animation-delay: 2.1s; animation-duration: 4.2s;"></div></div>
      <div class="meteor-wrapper" style="top: 5%; left: 90%;"><div class="meteor" style="animation-delay: 0.5s; animation-duration: 5.1s;"></div></div>
      <div class="meteor-wrapper" style="top: 80%; left: 50%;"><div class="meteor" style="animation-delay: 3.8s; animation-duration: 4.6s;"></div></div>
      <div class="meteor-wrapper" style="top: 15%; left: 10%;"><div class="meteor" style="animation-delay: 5.4s; animation-duration: 3.9s;"></div></div>
      <div class="meteor-wrapper" style="top: 45%; left: 95%;"><div class="meteor" style="animation-delay: 7.2s; animation-duration: 4.9s;"></div></div>
      <div class="meteor-wrapper" style="top: 35%; left: 40%;"><div class="meteor" style="animation-delay: 2.8s; animation-duration: 3.5s;"></div></div>
    </div>

    <main class="relative z-10">
      <section id="platform" class="relative isolate overflow-hidden border-b border-slate-200/80 dark:border-white/10">
        <div class="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-cyan-300/15 blur-[120px] dark:bg-cyan-500/10"></div>
        <div class="pointer-events-none absolute -right-40 top-64 h-[32rem] w-[32rem] rounded-full bg-blue-300/15 blur-[150px] dark:bg-blue-500/10"></div>

        <div class="relative mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36 lg:pb-32 lg:pt-40">
          <div class="grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)] lg:gap-16">
            <div class="relative z-10 max-w-2xl">
              <div class="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-200 bg-white/75 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 shadow-sm backdrop-blur dark:border-cyan-400/20 dark:bg-white/[0.05] dark:text-cyan-300 dark:shadow-none">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.75)] dark:bg-cyan-300"></span>
                <span>{{ copy.eyebrow }}</span>
              </div>

              <h1 class="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.55rem] dark:text-white">
                {{ copy.heroTitleLead }}
                <span class="block bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent dark:from-cyan-300 dark:via-cyan-400 dark:to-blue-400">{{ copy.heroTitleAccent }}</span>
              </h1>

              <p class="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300/75">
                {{ copy.heroDescription }}
              </p>

              <div class="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <NuxtLink
                  to="/user/Register"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-[0_16px_34px_rgba(8,145,178,0.22)] dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  {{ copy.primaryCta }}
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </NuxtLink>
                <NuxtLink
                  to="/#solutions"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/70 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-300"
                >
                  {{ copy.secondaryCta }}
                </NuxtLink>
              </div>

              <div class="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-cyan-600 dark:text-cyan-300">verified_user</span>{{ copy.trustA }}</span>
                <span class="inline-flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-cyan-600 dark:text-cyan-300">tune</span>{{ copy.trustB }}</span>
              </div>
            </div>

            <div class="relative min-w-0 lg:min-h-[560px]">
              <div class="orbit-visual pointer-events-none absolute inset-[-4%] z-0" aria-hidden="true">
                <svg viewBox="0 0 720 620" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="orbit-gradient" x1="80" y1="80" x2="640" y2="540" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#22D3EE" stop-opacity="0.08" />
                      <stop offset="0.5" stop-color="#06B6D4" stop-opacity="0.8" />
                      <stop offset="1" stop-color="#3B82F6" stop-opacity="0.12" />
                    </linearGradient>
                    <filter id="orbit-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="7" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <ellipse cx="360" cy="310" rx="310" ry="164" stroke="url(#orbit-gradient)" stroke-width="1.5" transform="rotate(-16 360 310)" class="orbit-visual__ring orbit-visual__ring--outer" />
                  <ellipse cx="360" cy="310" rx="260" ry="122" stroke="url(#orbit-gradient)" stroke-width="1" transform="rotate(27 360 310)" class="orbit-visual__ring orbit-visual__ring--inner" />
                  <circle cx="80" cy="232" r="5" fill="#22D3EE" filter="url(#orbit-glow)" class="orbit-visual__node" />
                  <circle cx="619" cy="385" r="4" fill="#3B82F6" filter="url(#orbit-glow)" class="orbit-visual__node orbit-visual__node--delay" />
                </svg>
              </div>

              <div class="dashboard-mockup relative z-10 mx-auto mt-2 w-full max-w-[640px] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-4 dark:border-cyan-300/15 dark:bg-[#0A0A0A]/95 dark:shadow-[0_32px_90px_rgba(0,0,0,0.38)]">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-white/10 dark:bg-[#050505]">
                  <div class="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
                    <div class="flex min-w-0 items-center gap-3">
                      <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300">
                        <span class="material-symbols-outlined text-[21px]">orbit</span>
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-xs font-bold uppercase tracking-[0.16em] text-slate-900 dark:text-white">Orbit Console</p>
                        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Enterprise workspace overview</p>
                      </div>
                    </div>
                    <span class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-300/15 dark:bg-emerald-300/10 dark:text-emerald-300"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Live</span>
                  </div>

                  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div class="dashboard-stat">
                      <span class="material-symbols-outlined dashboard-stat__icon">smart_toy</span>
                      <span class="dashboard-stat__label">Active AI Assistants</span>
                      <strong class="dashboard-stat__value">12</strong>
                    </div>
                    <div class="dashboard-stat">
                      <span class="material-symbols-outlined dashboard-stat__icon">group</span>
                      <span class="dashboard-stat__label">Users</span>
                      <strong class="dashboard-stat__value">48</strong>
                    </div>
                    <div class="dashboard-stat">
                      <span class="material-symbols-outlined dashboard-stat__icon">data_usage</span>
                      <span class="dashboard-stat__label">Token Usage</span>
                      <strong class="dashboard-stat__value">684,250</strong>
                    </div>
                    <div class="dashboard-stat">
                      <span class="material-symbols-outlined dashboard-stat__icon">workspace_premium</span>
                      <span class="dashboard-stat__label">Current Plan</span>
                      <strong class="dashboard-stat__value">Pro</strong>
                    </div>
                  </div>

                  <div class="mt-3 grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
                    <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-xs font-semibold text-slate-900 dark:text-white">Token consumption</p>
                          <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Monthly organization quota</p>
                        </div>
                        <span class="text-sm font-bold text-cyan-700 dark:text-cyan-300">68%</span>
                      </div>
                      <div class="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/70"><div class="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div></div>
                      <div class="mt-2 flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400"><span>684,250 used</span><span>1,000,000 limit</span></div>
                    </div>
                    <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.035]">
                      <p class="text-xs font-semibold text-slate-900 dark:text-white">Assistant activity</p>
                      <div class="mt-5 flex h-12 items-end gap-1.5">
                        <span v-for="height in [35, 48, 30, 62, 44, 74, 56, 88, 68, 96]" :key="height" class="w-full rounded-t bg-gradient-to-t from-cyan-500/40 to-cyan-400" :style="{ height: `${height}%` }"></span>
                      </div>
                      <div class="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400"><span>Last 30 days</span><span class="font-semibold text-emerald-600 dark:text-emerald-300">+18.4%</span></div>
                    </div>
                  </div>

                  <div class="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-200/80 bg-cyan-50/70 px-4 py-3 dark:border-cyan-300/15 dark:bg-cyan-300/[0.06]">
                    <div class="flex items-center gap-2.5"><span class="material-symbols-outlined text-[18px] text-cyan-700 dark:text-cyan-300">admin_panel_settings</span><span class="text-xs font-semibold text-slate-700 dark:text-slate-200">Organization controls are active</span></div>
                    <span class="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-700 dark:text-cyan-300">Secure workspace</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="relative border-t border-slate-200/80 bg-white/35 dark:border-white/10 dark:bg-white/[0.015]">
          <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div class="max-w-3xl">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.platformEyebrow }}</p>
              <h2 class="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl dark:text-white">{{ copy.platformTitle }}</h2>
              <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.platformDescription }}</p>
            </div>

            <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article v-for="(feature, index) in copy.features" :key="feature.title" class="feature-card group">
                <div class="flex items-start justify-between gap-4">
                  <span class="material-symbols-outlined feature-card__icon">{{ feature.icon }}</span>
                  <span class="feature-card__index">0{{ index + 1 }}</span>
                </div>
                <div class="mt-12">
                  <h3 class="text-base font-semibold text-slate-950 dark:text-white">{{ feature.title }}</h3>
                  <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300/65">{{ feature.description }}</p>
                </div>
              </article>
            </div>

            <div class="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-[0_18px_50px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#050505]/75 dark:shadow-none">
              <div class="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/10">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{{ copy.architectureEyebrow }}</p>
                  <h3 class="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{{ copy.architectureTitle }}</h3>
                </div>
                <p class="max-w-sm text-sm leading-6 text-slate-500 sm:text-right dark:text-slate-400">{{ copy.architectureDescription }}</p>
              </div>

              <div class="grid gap-3 p-5 sm:p-8 md:hidden">
                <template v-for="(node, index) in copy.architectureNodes" :key="node.title">
                  <div class="architecture-node">
                    <span class="architecture-node__eyebrow">{{ node.eyebrow }}</span>
                    <span class="architecture-node__title">{{ node.title }}</span>
                    <span class="architecture-node__desc">{{ node.description }}</span>
                  </div>
                  <div v-if="index < copy.architectureNodes.length - 1" class="flex justify-center text-cyan-600 dark:text-cyan-300"><span class="material-symbols-outlined">south</span></div>
                </template>
              </div>

              <div class="hidden items-center gap-3 p-8 md:grid md:grid-cols-[1fr_auto_1fr_auto_1.2fr_auto_1fr]">
                <template v-for="(node, index) in copy.architectureNodes" :key="node.title">
                  <div class="architecture-node min-h-[142px]">
                    <span class="architecture-node__eyebrow">{{ node.eyebrow }}</span>
                    <span class="architecture-node__title">{{ node.title }}</span>
                    <span class="architecture-node__desc">{{ node.description }}</span>
                  </div>
                  <div v-if="index < copy.architectureNodes.length - 1" class="architecture-connector"><span class="material-symbols-outlined">arrow_forward</span></div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SolutionsSection />
      <NewsSection />
      <EnterpriseSection />
      <PricingSection />

      <section class="relative overflow-hidden border-t border-slate-200/80 bg-white/35 dark:border-white/10 dark:bg-white/[0.015]">
        <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div class="final-cta-panel relative overflow-hidden rounded-3xl border border-cyan-200/80 bg-white/75 px-6 py-10 shadow-[0_20px_55px_rgba(15,23,42,0.07)] sm:px-12 sm:py-14 dark:border-cyan-300/15 dark:bg-[#0A0A0A]/90 dark:shadow-[0_20px_55px_rgba(0,0,0,0.2)]">
            <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-200/25 blur-[80px] dark:bg-cyan-500/10"></div>
            <div class="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-blue-200/20 blur-[80px] dark:bg-blue-500/10"></div>
            <div class="final-cta-orbit pointer-events-none absolute inset-0 opacity-70 dark:opacity-90" aria-hidden="true">
              <svg viewBox="0 0 1200 420" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="760" cy="210" rx="430" ry="145" stroke="url(#final-cta-gradient)" stroke-width="1.25" transform="rotate(-9 760 210)" />
                <ellipse cx="760" cy="210" rx="350" ry="104" stroke="url(#final-cta-gradient)" stroke-width="1" transform="rotate(14 760 210)" />
                <defs><linearGradient id="final-cta-gradient" x1="360" y1="80" x2="1120" y2="330" gradientUnits="userSpaceOnUse"><stop stop-color="#22D3EE" stop-opacity="0" /><stop offset="0.55" stop-color="#06B6D4" stop-opacity="0.32" /><stop offset="1" stop-color="#3B82F6" stop-opacity="0" /></linearGradient></defs>
              </svg>
            </div>

            <div class="relative z-10 max-w-2xl">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.finalCtaEyebrow }}</p>
              <h2 class="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">{{ copy.finalCtaTitle }}</h2>
              <p class="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.finalCtaDescription }}</p>
              <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <NuxtLink to="/user/Register" class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white no-underline shadow-[0_12px_28px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-cyan-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">
                  {{ copy.finalCtaPrimary }}
                  <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                </NuxtLink>
                <a href="mailto:enterprise@orbit.ai" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white/75 px-5 py-3.5 text-sm font-semibold text-slate-700 no-underline transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-700 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-300">{{ copy.finalCtaSecondary }}</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-[#000000]">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr] lg:px-10">
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/40 bg-cyan-50 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300">
              <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-6 w-7 object-contain" />
            </span>
            <span class="text-lg font-bold tracking-tight text-slate-950 dark:text-white">Orbit AI</span>
          </div>
          <p class="mt-5 text-sm leading-7 text-slate-500 dark:text-slate-400">{{ copy.footerTagline }}</p>
          <p class="mt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{{ copy.footerPlatformNote }}</p>
          <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">{{ copy.footerCopyright }}</p>
        </div>

        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 dark:text-white">{{ copy.footerPlatform }}</h2>
          <nav class="mt-5 flex flex-col items-start gap-3 text-sm text-slate-500 dark:text-slate-400" aria-label="Platform navigation">
            <NuxtLink to="/#platform" class="footer-link">{{ $t('navbar.platform') }}</NuxtLink>
            <NuxtLink to="/#solutions" class="footer-link">{{ $t('navbar.solutions') }}</NuxtLink>
            <NuxtLink to="/#news" class="footer-link">{{ $t('navbar.news') }}</NuxtLink>
            <NuxtLink to="/#enterprise" class="footer-link">{{ $t('navbar.enterprise') }}</NuxtLink>
            <NuxtLink to="/#pricing" class="footer-link">{{ $t('navbar.pricing') }}</NuxtLink>
          </nav>
        </div>

        <div>
          <h2 class="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 dark:text-white">{{ copy.footerAccount }}</h2>
          <nav class="mt-5 flex flex-col items-start gap-3 text-sm text-slate-500 dark:text-slate-400" aria-label="Account navigation">
            <NuxtLink to="/login" class="footer-link">{{ copy.footerSignIn }}</NuxtLink>
            <NuxtLink to="/user/Register" class="footer-link">{{ copy.footerRegister }}</NuxtLink>
          </nav>
          <h2 class="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-slate-950 dark:text-white">{{ copy.footerContact }}</h2>
          <a href="mailto:enterprise@orbit.ai" class="footer-link mt-5 inline-flex text-sm">{{ copy.footerEnterpriseContact }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SolutionsSection from '~/components/home/SolutionsSection.vue'
import NewsSection from '~/components/home/NewsSection.vue'
import EnterpriseSection from '~/components/home/EnterpriseSection.vue'
import PricingSection from '~/components/home/PricingSection.vue'

const { locale } = useI18n()

const copy = computed(() => locale.value === 'vi'
  ? {
      eyebrow: 'ORBIT AI · ENTERPRISE AI PLATFORM',
      heroTitleLead: 'Nền tảng trợ lý AI',
      heroTitleAccent: 'dành cho doanh nghiệp',
      heroDescription: 'Triển khai, quản lý và kiểm soát trợ lý AI, người dùng, dịch vụ và tài nguyên trên một nền tảng thống nhất.',
      primaryCta: 'Bắt đầu sử dụng',
      secondaryCta: 'Khám phá giải pháp',
      trustA: 'Kiểm soát theo tổ chức',
      trustB: 'Quota & billing tập trung',
      finalCtaEyebrow: 'READY FOR ENTERPRISE AI',
      finalCtaTitle: 'Sẵn sàng đưa AI vào doanh nghiệp của bạn?',
      finalCtaDescription: 'Bắt đầu với Orbit AI để quản lý trợ lý AI, người dùng và tài nguyên doanh nghiệp trên một nền tảng thống nhất.',
      finalCtaPrimary: 'Bắt đầu sử dụng',
      finalCtaSecondary: 'Liên hệ doanh nghiệp',
      footerTagline: 'Nền tảng trợ lý AI dành cho doanh nghiệp',
      footerPlatformNote: 'Enterprise AI Assistant Platform',
      footerCopyright: '© 2026 Orbit AI',
      footerPlatform: 'Nền tảng',
      footerAccount: 'Tài khoản',
      footerContact: 'Liên hệ',
      footerSignIn: 'Đăng nhập',
      footerRegister: 'Đăng ký',
      footerEnterpriseContact: 'Liên hệ doanh nghiệp',
      platformEyebrow: 'ONE PLATFORM · MANY POSSIBILITIES',
      platformTitle: 'Một nền tảng thống nhất cho AI doanh nghiệp',
      platformDescription: 'Orbit AI kết nối con người, tổ chức và dịch vụ AI trong một lớp quản lý trung tâm — rõ ràng về quyền truy cập, hạn mức và chi phí.',
      features: [
        { icon: 'smart_toy', title: 'Trợ lý AI', description: 'Triển khai và quản lý trợ lý AI cho người dùng doanh nghiệp.' },
        { icon: 'account_tree', title: 'Quản lý tổ chức', description: 'Quản lý tổ chức, người dùng và quyền truy cập tập trung.' },
        { icon: 'data_usage', title: 'Token & quota', description: 'Theo dõi token, hạn mức và mức sử dụng dịch vụ AI.' },
        { icon: 'receipt_long', title: 'Billing & plan', description: 'Quản lý gói dịch vụ và tài nguyên theo doanh nghiệp.' },
      ],
      architectureEyebrow: 'THE ORBIT CONTROL LAYER',
      architectureTitle: 'Một lớp quản lý trung tâm giữa doanh nghiệp và AI services',
      architectureDescription: 'Tổ chức là nơi kết nối người dùng, quyền truy cập và các dịch vụ AI trong cùng một workspace.',
      architectureNodes: [
        { eyebrow: '01 · PEOPLE', title: 'Users', description: 'Người dùng doanh nghiệp' },
        { eyebrow: '02 · CONTROL', title: 'Organization', description: 'Quyền và workspace' },
        { eyebrow: '03 · PLATFORM', title: 'Orbit AI Platform', description: 'Lớp điều phối trung tâm' },
        { eyebrow: '04 · OUTCOMES', title: 'AI services · Billing', description: 'Dịch vụ và tài nguyên' },
      ],
    }
  : {
      eyebrow: 'ORBIT AI · ENTERPRISE AI PLATFORM',
      heroTitleLead: 'The AI assistant platform',
      heroTitleAccent: 'for enterprise teams',
      heroDescription: 'Deploy, manage, and govern AI assistants, users, services, and resources from one unified platform.',
      primaryCta: 'Get started',
      secondaryCta: 'Explore solutions',
      trustA: 'Organization-level control',
      trustB: 'Centralized quota & billing',
      finalCtaEyebrow: 'READY FOR ENTERPRISE AI',
      finalCtaTitle: 'Ready to bring AI into your enterprise?',
      finalCtaDescription: 'Start with Orbit AI to manage assistants, users, and enterprise resources from one unified platform.',
      finalCtaPrimary: 'Get started',
      finalCtaSecondary: 'Contact enterprise team',
      footerTagline: 'The AI assistant platform for enterprise teams',
      footerPlatformNote: 'Enterprise AI Assistant Platform',
      footerCopyright: '© 2026 Orbit AI',
      footerPlatform: 'Platform',
      footerAccount: 'Account',
      footerContact: 'Contact',
      footerSignIn: 'Sign in',
      footerRegister: 'Register',
      footerEnterpriseContact: 'Contact enterprise team',
      platformEyebrow: 'ONE PLATFORM · MANY POSSIBILITIES',
      platformTitle: 'One platform for enterprise AI',
      platformDescription: 'Orbit AI connects people, organizations, and AI services through one control layer — with clear access, usage, and cost visibility.',
      features: [
        { icon: 'smart_toy', title: 'AI Assistants', description: 'Deploy and manage AI assistants for enterprise users.' },
        { icon: 'account_tree', title: 'Organization management', description: 'Centralize organizations, users, and access permissions.' },
        { icon: 'data_usage', title: 'Token & quota', description: 'Track tokens, limits, and AI service consumption.' },
        { icon: 'receipt_long', title: 'Billing & plans', description: 'Manage service plans and resources across the enterprise.' },
      ],
      architectureEyebrow: 'THE ORBIT CONTROL LAYER',
      architectureTitle: 'A control layer between the enterprise and AI services',
      architectureDescription: 'Organizations connect users, permissions, and AI services in one consistent workspace.',
      architectureNodes: [
        { eyebrow: '01 · PEOPLE', title: 'Users', description: 'Enterprise users' },
        { eyebrow: '02 · CONTROL', title: 'Organization', description: 'Permissions and workspace' },
        { eyebrow: '03 · PLATFORM', title: 'Orbit AI Platform', description: 'Central orchestration layer' },
        { eyebrow: '04 · OUTCOMES', title: 'AI services · Billing', description: 'Services and resources' },
      ],
    })

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.orbit-visual__ring {
  transform-origin: center;
  animation: orbit-drift 18s ease-in-out infinite alternate;
}

.orbit-visual__ring--inner {
  animation-duration: 24s;
  animation-direction: alternate-reverse;
}

.orbit-visual__node {
  animation: orbit-pulse 4s ease-in-out infinite;
}

.orbit-visual__node--delay {
  animation-delay: -2s;
}

.dashboard-mockup {
  transform: perspective(1200px) rotateY(-5deg) rotateX(2deg);
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 700ms ease;
}

.dashboard-mockup:hover {
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(-4px);
}

.dashboard-stat {
  @apply flex min-h-[108px] flex-col rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.035];
}

.dashboard-stat__icon {
  @apply text-[17px] text-cyan-700 dark:text-cyan-300;
}

.dashboard-stat__label {
  @apply mt-3 text-[10px] font-medium leading-4 text-slate-500 dark:text-slate-400;
}

.dashboard-stat__value {
  @apply mt-auto text-lg font-semibold tracking-tight text-slate-950 dark:text-white;
}

.feature-card {
  @apply flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition duration-300 dark:border-cyan-300/15 dark:bg-[#0A0A0A] dark:shadow-none;
}

.feature-card:hover {
  @apply -translate-y-1 border-cyan-300 shadow-[0_18px_34px_rgba(8,145,178,0.12)] dark:border-cyan-300/35 dark:shadow-[0_18px_38px_rgba(6,182,212,0.08)];
}

.feature-card__icon {
  @apply text-[27px] text-cyan-700 transition duration-300 dark:text-cyan-300;
}

.feature-card:hover .feature-card__icon {
  @apply text-blue-600 dark:text-cyan-200;
}

.feature-card__index {
  @apply rounded border border-slate-200 px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-slate-400 dark:border-white/10 dark:text-slate-500;
}

.architecture-node {
  @apply flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-white/[0.035];
}

.architecture-node__eyebrow {
  @apply text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300;
}

.architecture-node__title {
  @apply mt-4 text-base font-semibold text-slate-950 dark:text-white;
}

.architecture-node__desc {
  @apply mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400;
}

.architecture-connector {
  @apply flex items-center justify-center text-cyan-600 dark:text-cyan-300;
}

.footer-link {
  @apply no-underline transition-colors hover:text-cyan-700 dark:hover:text-cyan-300;
}

@keyframes orbit-drift {
  0% { transform: rotate(-1deg) scale(0.98); opacity: 0.68; }
  100% { transform: rotate(3deg) scale(1.02); opacity: 1; }
}

@keyframes orbit-pulse {
  0%, 100% { opacity: 0.5; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.12); }
}

@media (max-width: 1023px) {
  .dashboard-mockup {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit-visual__ring,
  .orbit-visual__node,
  .dashboard-mockup,
  .meteor {
    animation: none;
    transition: none;
    transform: none;
  }
}

/* Meteor Shower */
.meteor-wrapper {
  position: absolute;
  transform: rotate(135deg);
}

.meteor {
  position: absolute;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 1));
  opacity: 0;
  animation: meteor-fall linear infinite;
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(34, 211, 238, 0.8));
}

.meteor::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px 2px rgba(34, 211, 238, 1);
}

@keyframes meteor-fall {
  0% {
    opacity: 0;
    transform: translateX(-300px);
  }
  15% {
    opacity: 1;
  }
  40% {
    opacity: 0;
    transform: translateX(600px);
  }
  100% {
    opacity: 0;
    transform: translateX(600px);
  }
}
</style>
