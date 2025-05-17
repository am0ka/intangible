import { defineStore } from "pinia"
import type { Ref } from "vue"

export interface User {
  _id: string
  discord_id: string
  global_name: string
  server_name: string
  main_role: 'tank' | 'dps' | 'heal'
  avatar?: string
  email?: string
}

export const useAuthStore = defineStore("user", () => {

  const user: Ref<User | undefined> = ref()
  const error: Ref<any> = ref()
  const isLoggedIn = ref(false)
  const loggingIn = ref(false)

  const signOut = async () => {
    await $fetch("/api/auth/me", {
      method: "DELETE",
    }).catch((error) => {
      error.value = error
    }).finally(() => {
      loggingIn.value = false
    })
    user.value = undefined
    isLoggedIn.value = false
    loggingIn.value = false
  }

  const signInWithDiscord = () => {
    const loginUrl = useRuntimeConfig().public.DISCORD_LOGIN_URL! as string
    window.location.assign(loginUrl)
  }

  const confirmDiscordLogin = async () => {
    loggingIn.value = true
    try {
      const response = await $fetch<any>("/api/auth/me", {
        method: "GET"
      })
      
      if (response?.user) {
        user.value = response.user
        isLoggedIn.value = true
      } else {
        error.value = new Error("Failed to get user info")
      }
    } catch (err) {
      error.value = err
    } finally {
      loggingIn.value = false
    }
  }

  const checkSession = async () => {
    try {
      const response = await $fetch<any>("/api/auth/me")
      if (response?.user) {
        user.value = response.user
        isLoggedIn.value = true
      }
    } catch (err: unknown) {
      error.value = err
    } finally {
      loggingIn.value = false
    }
  }

  return {
    user,
    error,
    isLoggedIn,
    loggingIn,
    signInWithDiscord,
    confirmDiscordLogin,
    signOut,
    checkSession,
  }
})