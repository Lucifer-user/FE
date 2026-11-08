<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <GoogleLogin v-model:username="username" />
  </div>
</template>

<script setup>
  import GoogleLogin from '~/components/GoogleLogin.vue';

  import { ref } from 'vue'; 
  const username = ref('Guest Hello');
</script>
