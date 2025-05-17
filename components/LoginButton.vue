<template>
  <button
    class="login-button"
    :class="{ 'mobile-login-button': isMobile }"
    @click="signInWithDiscord"
  >
    Log in
  </button>
</template>

<script setup lang="ts">

const { signInWithDiscord } = useAuth()

defineProps<{
  isMobile?: boolean
}>()

</script>

<style scoped>
.login-button {
  padding: 0.5rem 1rem;
  background-color: #5865F2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-button:hover {
  background-color: #4752C4;
}

.mobile-login-button {
  width: 100%;
  padding: 0.75rem;
}
</style> 