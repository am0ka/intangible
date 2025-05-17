import { useSupabaseClient, useSupabaseUser } from '#imports'
import type { Database } from '~/supabase/database.types'

type UserInsert = Database['public']['Tables']['users']['Insert']

export const useAuth = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const signInWithDiscord = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'identify email guilds guilds.members.read'
      }
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const getUserData = async () => {
    if (!user.value) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('discord_id', user.value.user_metadata.provider_id)
      .single()

    if (error) {
      // If user doesn't exist, create them
      if (error.code === 'PGRST116') {
        const newUser: UserInsert = {
          discord_id: user.value.user_metadata.provider_id,
          global_name: user.value.user_metadata.full_name || '',
          server_name: user.value.user_metadata.name || '',
          last_used_role: 'dps' // Default role
        }

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single()

        if (createError) throw createError
        return createdUser
      }
      throw error
    }
    return data
  }

  const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  return {
    user,
    signInWithDiscord,
    signOut,
    getUserData,
    getSession
  }
} 