<template>
  <div>
    <ClientOnly>
      <HomeAdmin />
    </ClientOnly>
  </div>
</template>

<script setup>
import HomeAdmin from '~/components/views/admin/HomeAdmin.vue'
definePageMeta({
  layout: 'layout-admin' 
})
</script>