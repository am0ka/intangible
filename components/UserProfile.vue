<template>
  <div class="user-profile">
    <div class="profile-group" @click="navigateToProfile">
      <img :src="avatarSrc" :alt="userData?.server_name" class="avatar" />
      <span class="username">{{ userName }}</span>
    </div>
    <button class="logout-button" title="Logout" @click="handleLogout">
      <Icon name="heroicons:arrow-right-on-rectangle" class="logout-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const userData = ref<{ server_name: string; id: string } | null>(null)

// Fetch user data from database
const fetchUserData = async () => {
  if (!user.value) return

  try {
    const { data, error } = await supabase
      .from('users')
      .select('server_name, id')
      .eq('discord_id', user.value.user_metadata.provider_id)
      .single()

    if (error) throw error
    userData.value = data
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const navigateToProfile = () => {
  if (userData.value?.id) {
    router.push(`/members/${userData.value.id}`)
  }
}

// Watch for user changes and fetch data
watch(user, (newUser) => {
  if (newUser) {
    fetchUserData()
  } else {
    userData.value = null
  }
}, { immediate: true })

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    userData.value = null
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const userName = computed(() => {
  const serverName = userData.value?.server_name;
  if (!serverName) return ''
  const match = serverName.match(/\((.*?)\)/)
  return match ? match[1] : serverName
})

const avatarSrc = computed(() => {
  if (!user.value) return ''

  const avatar = user.value.user_metadata?.avatar_url
  if (avatar) {
    return avatar
  } else {
    const defaultAvatarIndex = (BigInt(user.value.id) >> 22n) % 6n
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
  }
})
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-group:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  color: white;
}

.logout-button {
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.logout-icon {
  width: 20px;
  height: 20px;
  color: #ef4444;
}

.logout-button:hover {
  opacity: 0.8;
}
</style>