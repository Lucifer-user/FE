<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black relative transition-colors duration-500">
    <!-- Hiệu ứng tuyết rơi nền -->
    <AtmosphericSnow />
    
    <div class="relative z-10">
      <navbar />
      <main class="min-h-screen lg:ml-[260px]">
        <slot />
      </main>
    </div>
  </div>
</template>


<script setup>
import navbar from '~/components/views/admin/navbar.vue';

</script>