<template>
  <div>
    <UserManagement />
  </div>
</template>

<script setup>
import UserManagement from '~/components/views/admin/users.vue'

definePageMeta({
  
  layout: 'layout-admin' 
})
</script>