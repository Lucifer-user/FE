<template>
  <Listbox v-model="modelValue" as="div" class="relative" :disabled="disabled">
    <ListboxButton 
      :class="[
        'w-full flex items-center justify-between gap-2 cursor-pointer text-left outline-none transition-colors',
        buttonClass || 'rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :title="''"
    >
      <span class="truncate block">
        {{ selectedOptionLabel }}
      </span>
      <span class="material-symbols-outlined text-base text-slate-400">expand_more</span>
    </ListboxButton>

    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <ListboxOptions class="absolute right-0 mt-1 w-full max-h-60 overflow-auto rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 py-1 text-sm shadow-2xl focus:outline-none z-50">
        <ListboxOption
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          v-slot="{ active, selected }"
        >
          <li :class="[active ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-white/80', 'relative cursor-pointer select-none py-2.5 px-4 transition-colors flex justify-between items-center text-sm']">
            <span :class="[selected ? 'font-bold' : 'font-normal', 'block truncate']">
              {{ option.label }}
            </span>
            <span v-if="selected" class="material-symbols-outlined text-sm text-cyan-500">check</span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true,
  },
  buttonClass: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select'
  }
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedOptionLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})
</script>
