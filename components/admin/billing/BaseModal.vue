<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="modelValue" class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" @click.self="close">
        <section class="flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-black" :class="widthClass" role="dialog" aria-modal="true" :aria-labelledby="titleId">
          <header class="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-white/10">
            <div>
              <h2 :id="titleId" class="text-xl font-extrabold text-slate-900 dark:text-white">{{ title }}</h2>
              <p v-if="description" class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" :disabled="busy" :aria-label="t('pricing_ui.close')" @click="close">
              <span class="material-symbols-outlined">close</span>
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5"><slot /></div>
          <footer v-if="$slots.footer" class="border-t border-slate-200 px-6 py-4 dark:border-white/10"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n()
const props = withDefaults(defineProps<{ modelValue: boolean; title: string; description?: string; busy?: boolean; size?: 'md' | 'lg' | 'xl' }>(), { description: '', busy: false, size: 'lg' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const titleId = `billing-modal-${Math.random().toString(36).slice(2)}`
const widthClass = computed(() => ({ md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[props.size]))
const close = () => { if (!props.busy) emit('update:modelValue', false) }
</script>
