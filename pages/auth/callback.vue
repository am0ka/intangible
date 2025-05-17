<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Processing authentication...</h1>
      <p class="text-gray-600">Please wait while we complete your sign in.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getSession } = useAuth()

onMounted(async () => {
  try {
    const session = await getSession()
    if (session) {
      // Call our API endpoint to update user data
      await $fetch('/api/auth/update-user', {
        method: 'POST',
        body: { session }
      })

      // Redirect to home page
      router.push('/')
    }
  } catch (error) {
    console.error('Authentication error:', error)
    // Handle error appropriately
  }
})
</script> 