export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ['/']
  const isPublicPage = publicPages.includes(to.path)

  // If it's a public page, allow access
  if (isPublicPage) {
    return
  }

  // Check if user is authenticated using Supabase
  const supabase = useSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Show notification
    const toast = useToast()
    toast.error({ title: "Not authenticated", message: "To visit this page please log in", position: "bottomRight" })

    // Redirect to home page if not authenticated
    return navigateTo('/')
  }
}) 