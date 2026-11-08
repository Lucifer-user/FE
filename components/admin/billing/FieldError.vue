<template><p v-if="errors?.length" class="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{{ errors[0] }}</p></template>
<script setup lang="ts">defineProps<{ errors?: string[] }>()</script>

