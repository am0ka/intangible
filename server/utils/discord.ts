import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/supabase/database.types'

const config = useRuntimeConfig()

if (!config.public.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase configuration')
}

const supabase = createClient<Database>(
  config.public.SUPABASE_URL as string,
  config.SUPABASE_SERVICE_KEY as string
)

export const getGuildMemberInfo = async (accessToken: string) => {
  try {
    const response = await $fetch(`https://discord.com/api/users/@me/guilds/874609819057815552/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response
  } catch (error) {
    console.error('Error getting guild member info:', error)
    throw error
  }
}

type UserInsert = Database['public']['Tables']['users']['Insert']

export const updateUserData = async (userData: {
  discord_id: string
  global_name: string
  server_name: string
  last_used_role: 'tank' | 'dps' | 'heal'
  role: 'admin' | 'user'
}) => {
  const insertData: UserInsert = {
    discord_id: userData.discord_id,
    global_name: userData.global_name,
    server_name: userData.server_name,
    last_used_role: userData.last_used_role,
    role: userData.role
  }

  const { error } = await supabase
    .from('users')
    .upsert(insertData, {
      onConflict: 'discord_id'
    })

  if (error) {
    console.error('Error updating user data:', error)
    throw error
  }
}

export const getUserData = async (authId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('discord_id', authId)
    .single()

  if (error) {
    console.error('Error getting user data:', error)
    throw error
  }

  return data
}
