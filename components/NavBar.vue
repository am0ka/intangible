<template>
  <nav class="navbar">
    <div class="navbar-left">
      <NuxtLink to="/" class="guild-name">Intangible</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/events" class="nav-link" active-class="active">Events</NuxtLink>
        <NuxtLink to="/members" class="nav-link" active-class="active">Members</NuxtLink>
        <NuxtLink to="/timetable" class="nav-link" active-class="active">Timetable</NuxtLink>
        <NuxtLink to="/auction" class="nav-link" active-class="active">Auction</NuxtLink>
      </div>
    </div>
    <div class="navbar-right">
      <template v-if="user">
        <UserProfile :user="user" />
      </template>
      <LoginButton v-else />
    </div>
    <button class="menu-button" @click="isMenuOpen = !isMenuOpen">
      <Icon name="material-symbols:menu" size="24" />
    </button>
    <div class="mobile-menu" :class="{ 'is-open': isMenuOpen }">
      <button class="close-button" @click="isMenuOpen = false">
        <Icon name="material-symbols:close-rounded" size="24" />
      </button>
      <div class="mobile-nav-links">
        <NuxtLink to="/events" class="mobile-nav-link" active-class="active" @click="isMenuOpen = false">Events</NuxtLink>
        <NuxtLink to="/members" class="mobile-nav-link" active-class="active" @click="isMenuOpen = false">Members</NuxtLink>
        <NuxtLink to="/timetable" class="mobile-nav-link" active-class="active" @click="isMenuOpen = false">Timetable</NuxtLink>
        <NuxtLink to="/auction" class="mobile-nav-link" active-class="active" @click="isMenuOpen = false">Auction</NuxtLink>
      </div>
      <div class="mobile-auth">
        <template v-if="user">
          <UserProfile :user="user" />
        </template>
        <LoginButton v-else :is-mobile="true" />
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { useSupabaseUser } from '#imports'
import UserProfile from './UserProfile.vue'
import LoginButton from './LoginButton.vue'

const user = useSupabaseUser()
const isMenuOpen = ref(false)
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  color: white;
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.guild-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #a0a0a0;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: white;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 2rem;
  transition: right 0.3s ease-in-out;
  z-index: 1000;
}

.mobile-menu.is-open {
  right: 0;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.mobile-nav-link {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: white;
}

.mobile-auth {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-links,
  .navbar-right {
    display: none;
  }

  .guild-name {
    font-size: 1.25rem;
  }

  .menu-button {
    display: block;
  }

  .mobile-menu {
    display: block;
  }
}
</style> 