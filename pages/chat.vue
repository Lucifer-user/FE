<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold mb-4 text-center">{{ $t('public.chat.title') }}</h1>
      <p class="text-center text-gray-600 mb-8">{{ $t('public.chat.subtitle') }}</p>
      
      <ClientOnly>
        <div class="max-w-2xl mx-auto">
          <AIChatContainer />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import AIChatContainer from '~/components/ai-chat/AIChatContainer.vue'
</script>
