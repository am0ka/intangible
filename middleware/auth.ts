export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // If user is not logged in and trying to access a protected route
  if (!user.value && to.path !== '/auth/login') {
    return navigateTo('/auth/login')
  }

  // If user is logged in and trying to access login page
  if (user.value && to.path === '/auth/login') {
    return navigateTo('/')
  }
}) 