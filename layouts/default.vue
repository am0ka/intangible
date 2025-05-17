<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <NavBar />
    <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
// Dark mode is handled by Nuxt UI automatically
</script>

<style>
/* Additional custom styles can be added here if needed */
</style>