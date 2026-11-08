<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
    <div class="glass-container w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative border-cyan-400/20 scale-up-center">
      <button @click="$emit('close-modal')" class="absolute top-10 right-10 text-white/20 hover:text-white transition-all hover:rotate-90">
        <span class="material-symbols-outlined text-3xl">close</span>
      </button>

      <div v-if="!qrUrl" class="mb-12">
        <h2 class="text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
          {{ props.paymentType === 'token_topup' ? t('pricing_ui.token_topup_title') : t('billing.topup.title') }}
        </h2>
        <p class="text-sm text-white/40 mt-1">
          {{ props.paymentType === 'token_topup' ? t('pricing_ui.token_topup_desc') : t('billing.topup.subtitle') }}
        </p>
      </div>

      <div v-if="!qrUrl" class="space-y-10">
        <div
          v-if="props.paymentType === 'subscription_upgrade'"
          class="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4"
        >
          <span class="text-[10px] font-bold uppercase tracking-widest text-white/40">{{ $t('billing.billing_cycle') }}</span>
          <span class="text-sm font-bold text-cyan-400">
            {{ props.billingCycle === 'annual' ? $t('public.pricing.annual') : $t('public.pricing.monthly') }}
          </span>
        </div>

        <div v-if="billingCatalogError" class="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5 text-sm text-rose-200">
          {{ t('pricing_ui.billing_error') }}
          <button type="button" class="mt-4 rounded-xl border border-rose-300/30 px-4 py-2 text-xs font-bold uppercase tracking-widest" @click="retryCatalog">{{ t('pricing_ui.retry') }}</button>
        </div>
        <div v-else-if="!displayPackages.length" class="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/50">
          {{ t('pricing_ui.catalog_empty') }}
        </div>
        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="pkg in displayPackages"
            :key="pkg.id"
            @click="!pkg.disabled && (selectedPackageId = pkg.id)"
            :class="[selectedPackageId === pkg.id ? 'border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5', pkg.disabled ? 'cursor-not-allowed opacity-45' : '']"
            class="flex items-center justify-between p-6 border rounded-2xl cursor-pointer transition-all group relative overflow-hidden"
          >
            <div v-if="pkg.popular" class="absolute top-0 right-0 bg-gradient-to-r from-cyan-400 to-purple-600 text-black text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md">
              {{ $t('billing.topup.popular_badge') }}
            </div>

            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform" :class="selectedPackageId === pkg.id ? 'text-cyan-400' : 'text-white/20'">
                <span class="material-symbols-outlined text-3xl">{{ pkg.icon }}</span>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-xl font-bold text-white">{{ pkg.name }}</span>
                </div>
                <p class="text-[10px] text-white/50 uppercase tracking-widest mt-1 mb-2">{{ pkg.desc }}</p>
                <p class="text-[12px] text-cyan-400 font-bold uppercase tracking-widest">
                  {{ pkg.price }}
                  <span v-if="pkg.period" class="text-white/30 text-[9px] font-normal ml-1">{{ pkg.period }}</span>
                </p>
                <p v-if="pkg.disabled" class="mt-1 text-[9px] font-bold uppercase tracking-widest text-amber-300">{{ t('pricing_ui.cannot_buy') }}</p>
                <p v-if="pkg.discountPercent > 0" class="mt-1 text-[10px] text-white/35 line-through">
                  {{ pkg.basePrice }}
                </p>
                <p v-if="pkg.discountPercent > 0" class="mt-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                  {{ t('pricing_ui.annual_discount', { percent: pkg.discountPercent }) }}
                </p>
              </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center" :class="selectedPackageId === pkg.id ? 'border-cyan-400' : 'border-white/10'">
              <div v-if="selectedPackageId === pkg.id" class="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,240,255,1)]"></div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="text-[10px] text-white/30 uppercase tracking-widest font-bold ml-1">{{ $t('billing.topup.payment_gateway') }}</label>
          <div class="grid grid-cols-1 gap-4">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              @click="selectedMethodId = method.id"
              :class="selectedMethodId === method.id ? 'border-cyan-400/50 bg-cyan-400/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'"
              class="flex flex-col items-center gap-4 p-6 border rounded-2xl cursor-pointer transition-all"
            >
              <span class="text-[14px] font-bold tracking-widest" :class="selectedMethodId === method.id ? 'text-cyan-400' : 'text-white/20'">{{ method.name }}</span>
              <span class="text-[10px] uppercase text-white/40">{{ $t('billing.topup.gateway_desc') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!qrUrl" class="mt-12 flex flex-col gap-6">
        <div class="flex items-center justify-between px-2">
          <span class="text-sm text-white/40">{{ $t('billing.topup.total_value') }}</span>
          <span class="text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight">{{ currentPackagePrice }}</span>
        </div>
        <button @click="handleTopup" :disabled="isLoading" class="deposit-btn w-full py-5 rounded-2xl font-bold text-white uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3">
          <span v-if="isLoading" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          {{ isLoading ? $t('billing.topup.processing') : $t('billing.topup.confirm') }}
        </button>
      </div>

      <div v-else-if="!paymentSuccess" class="flex flex-col items-center justify-center py-8">
        <h2 class="text-2xl font-bold text-cyan-400 mb-2">{{ $t('billing.topup.qr_title') }}</h2>
        <p class="text-sm text-white/60 mb-8 text-center max-w-sm">
          {{ props.paymentType === 'token_topup' ? t('pricing_ui.scan_qr_token_desc') : t('billing.topup.qr_desc') }}
        </p>

        <div class="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.2)]">
          <img :src="qrUrl" alt="Payment QR Code" class="w-64 h-64 object-contain rounded-xl" />
        </div>

        <div class="mt-8 text-center w-full">
          <p class="text-white/40 text-xs uppercase tracking-widest mb-2">{{ $t('billing.topup.order_code') }}</p>
          <p class="text-2xl font-mono text-white font-bold bg-white/5 px-6 py-3 rounded-xl border border-white/10">{{ orderCode }}</p>
          <p class="mt-4 text-white/40 text-xs uppercase tracking-widest mb-2">{{ t('pricing_ui.transfer_content') }}</p>
          <p class="font-mono text-cyan-200 font-bold bg-cyan-400/10 px-5 py-3 rounded-xl border border-cyan-400/20 break-all">{{ transferDescription || orderCode }}</p>
          <p class="mt-3 text-xs text-amber-200/80">{{ t('pricing_ui.transfer_note') }}</p>
          <p class="mt-4 text-sm font-bold" :class="paymentExpired ? 'text-rose-300' : 'text-amber-200'">
            {{ paymentExpired ? t('pricing_ui.qr_expired') : t('pricing_ui.qr_expires_in', { seconds: remainingSeconds ?? 0 }) }}
          </p>
        </div>

        <button @click="$emit('close-modal')" class="mt-10 px-8 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">
          {{ $t('billing.topup.cancel') }}
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
        <div class="w-24 h-24 rounded-full bg-cyan-400/20 border border-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,240,255,0.4)]">
          <span class="material-symbols-outlined text-cyan-400 text-5xl">check_circle</span>
        </div>
        <h2 class="text-3xl font-bold text-white font-['Space_Grotesk'] tracking-tight mb-2">{{ $t('billing.topup.success_title') }}</h2>
        <p class="text-white/60 text-center mb-10">{{ $t('billing.topup.success_desc') }}</p>

        <button @click="$emit('close-modal')" class="deposit-btn w-full py-5 rounded-2xl font-bold text-white uppercase tracking-[0.2em] text-[11px] flex items-center justify-center">
          {{ $t('billing.topup.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted, inject } from 'vue'
import { refreshNuxtData } from '#app'

const props = defineProps({
  paymentType: {
    type: String,
    default: 'subscription_upgrade'
  },
  organizationId: {
    type: String,
    default: ''
  },
  initialPlanId: {
    type: String,
    default: ''
  },
  billingCycle: {
    type: String,
    default: 'monthly',
    validator: value => ['monthly', 'annual'].includes(value)
  }
})

const emit = defineEmits(['close-modal', 'payment-success'])
const { t, locale } = useI18n()
const { plans: billingPlans, topupPackages: billingTopupPackages, loadError: billingCatalogError, load: loadBillingCatalog } = useBillingCatalog()

const selectedPackageId = ref('')
const selectedMethodId = ref('sepay')
const isLoading = ref(false)
const qrUrl = ref('')
const orderCode = ref('')
const transferDescription = ref('')
const paymentSuccess = ref(false)
const checkStatusInterval = ref(null)
const countdownInterval = ref(null)
const remainingSeconds = ref(null)
const paymentExpired = ref(false)
const route = useRoute()
const currentOrganizationId = inject('currentOrganizationId', ref(null))

const stopStatusPolling = () => {
  if (checkStatusInterval.value) {
    clearInterval(checkStatusInterval.value)
    checkStatusInterval.value = null
  }
}

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const markPaymentExpired = () => {
  paymentExpired.value = true
  remainingSeconds.value = 0
  stopStatusPolling()
}

const checkPaymentStatus = async (force = false) => {
  if (!orderCode.value || (paymentExpired.value && !force)) return

  try {
    const config = useRuntimeConfig()
    const accessToken = useCookie('accessToken')
    const orgId = props.organizationId || currentOrganizationId?.value || ''
    const res = await $fetch(`${config.public.apiBase}/partner/billing/payments/${orderCode.value}/status`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        ...(orgId ? { 'X-Organization-Id': orgId } : {})
      }
    })

    if (res?.status === 'success' || res?.status === 'paid') {
      paymentSuccess.value = true
      stopStatusPolling()
      stopCountdown()
      emit('payment-success', {
        purchased_tokens: res?.purchased_tokens,
        payment_type: res?.payment_type
      })
      refreshNuxtData()
    } else if (['expired', 'cancelled'].includes(res?.status)) {
      markPaymentExpired()
    }
  } catch (e) {
    console.error('Polling check status error:', e)
  }
}

const startPolling = () => {
  stopStatusPolling()
  checkStatusInterval.value = setInterval(() => checkPaymentStatus(), 3000)
}

const startCountdown = (expiresAt) => {
  stopCountdown()
  const expiryTimestamp = Date.parse(expiresAt)
  if (!Number.isFinite(expiryTimestamp)) return

  paymentExpired.value = false
  const tick = () => {
    const seconds = Math.max(0, Math.ceil((expiryTimestamp - Date.now()) / 1000))
    remainingSeconds.value = seconds
    if (seconds === 0) {
      stopCountdown()
      markPaymentExpired()
      checkPaymentStatus(true)
    }
  }

  tick()
  countdownInterval.value = setInterval(tick, 250)
}

onUnmounted(() => {
  stopStatusPolling()
  stopCountdown()
})

const formatCurrency = (value, currency = 'VND') => `${new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(value)} ${currency}`

const catalogSubscriptionPrice = (plan, cycle) => {
  const catalogPrice = cycle === 'annual'
    ? (plan?.final_annual_price ?? plan?.annual_price)
    : (plan?.final_monthly_price ?? plan?.monthly_price)
  return Number(catalogPrice ?? 0)
}

const catalogSubscriptionPeriod = (plan, cycle) => {
  const months = cycle === 'annual'
    ? Number(plan?.annual_duration_months ?? plan?.duration_months_annual ?? 12)
    : Number(plan?.monthly_duration_months ?? plan?.duration_months ?? 1)

  if (cycle === 'annual' && months === 12) return t('billing.topup.per_year')
  if (cycle === 'monthly' && months === 1) return t('billing.topup.per_month')
  return t('pricing_ui.period_months', { months })
}

const subscriptionPackages = computed(() => {
  if (billingCatalogError.value) return []

  return billingPlans.value
    .map((plan, index) => {
      const priceValue = catalogSubscriptionPrice(plan, props.billingCycle)
      const basePrice = props.billingCycle === 'annual'
        ? Number(plan.annual_price || 0)
        : Number(plan.monthly_price || 0)
      const discountPercent = props.billingCycle === 'annual' ? Number(plan.annual_discount_percent || 0) : 0
      return {
        id: plan.code,
        name: plan.name,
        priceValue,
        price: formatCurrency(priceValue, plan.currency),
        period: catalogSubscriptionPeriod(plan, props.billingCycle),
        basePrice: formatCurrency(basePrice, plan.currency),
        discountPercent,
        desc: plan.description || plan.name,
        icon: index === 0 ? 'trending_up' : 'diamond',
        popular: index === 0 && plan.is_sellable && !plan.is_default,
        disabled: !plan.is_sellable || Boolean(plan.is_default),
      }
    })
})

const tokenPackages = computed(() => {
  const source = billingCatalogError.value ? [] : billingTopupPackages.value

  return source.map((item, index) => {
    const priceValue = Number(item.price ?? 0)

    return {
      id: item.code || item.id,
      name: item.name,
      priceValue,
      price: formatCurrency(priceValue, item.currency || 'VND'),
      desc: item.description || item.name,
      icon: 'electric_bolt',
      popular: index === 0,
      disabled: !item.is_sellable,
    }
  })
})

const displayPackages = computed(() => props.paymentType === 'token_topup' ? tokenPackages.value : subscriptionPackages.value)

const currentPackagePrice = computed(() => {
  return displayPackages.value.find(p => p.id === selectedPackageId.value)?.price || formatCurrency(0, 'VND')
})

onMounted(async () => {
  await loadBillingCatalog()
  if (route.query.plan) {
    const validPlan = subscriptionPackages.value.find(p => p.id === route.query.plan)
    if (validPlan) {
      selectedPackageId.value = validPlan.id
    }
  }
  if (!displayPackages.value.some(pkg => pkg.id === selectedPackageId.value && !pkg.disabled)) {
    selectedPackageId.value = displayPackages.value.find(pkg => !pkg.disabled)?.id || ''
  }
})

const retryCatalog = async () => {
  await loadBillingCatalog(true)
  selectedPackageId.value = displayPackages.value.find(pkg => !pkg.disabled)?.id || ''
}

const paymentMethods = computed(() => [
  { id: 'sepay', name: t('billing.topup.payment_methods.sepay_name') }
])

const handleTopup = async () => {
  const pkg = displayPackages.value.find(p => p.id === selectedPackageId.value)
  if (!pkg || pkg.disabled) return
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const accessToken = useCookie('accessToken')

    const bodyData = {
      payment_type: props.paymentType,
      payment_method: selectedMethodId.value
    }

    if (props.paymentType === 'subscription_upgrade') {
      bodyData.plan_type = pkg.id
      bodyData.billing_cycle = props.billingCycle
    } else {
      bodyData.package_code = pkg.id
    }

    const orgId = props.organizationId || currentOrganizationId?.value || ''
    const response = await $fetch(`${config.public.apiBase}/partner/billing/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/json',
        ...(orgId ? { 'X-Organization-Id': orgId } : {})
      },
      body: bodyData
    })

    if (response?.status === 'success' && response?.data?.qr_url) {
      qrUrl.value = response.data.qr_url
      orderCode.value = response.data.order_code
      transferDescription.value = response.data.description || response.data.order_code
      remainingSeconds.value = null
      paymentExpired.value = false
      startCountdown(response.data.expires_at)
      startPolling()
    }
  } catch (error) {
    console.error('Payment error:', error)
    const toast = useToast()
    if (error.data && error.data.message) {
      toast.error(error.data.message)
    } else {
      toast.error(t('pricing_ui.payment_error'))
    }
    emit('close-modal')
    isLoading.value = false
  }
}
</script>

<style scoped>
.scale-up-center {
  animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@keyframes scale-up-center {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.deposit-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
}

.deposit-btn:hover {
  box-shadow: 0 0 50px rgba(0, 240, 255, 0.5);
  filter: brightness(1.1);
}
</style>
