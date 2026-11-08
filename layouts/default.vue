<template>
  <div class="min-h-screen" style="background-color: var(--bg-color);">
    <Navbar />
    <slot />
    <!-- Footer is now inside pages to allow for specific styling, or can be moved back here if standardized -->
  </div>
</template>

<script setup>
import Navbar from '~/components/views/navbar.vue'
import Footer from '~/components/Footer.vue'
</script>