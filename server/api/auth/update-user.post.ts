import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/supabase/database.types'
import { getGuildMemberInfo, updateUserData } from '~/server/utils/discord'

const config = useRuntimeConfig()

if (!config.public.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase configuration')
}

const supabase = createClient<Database>(
  config.public.SUPABASE_URL as string,
  config.SUPABASE_SERVICE_KEY as string
)

interface GuildMember {
  nick: string | null
  roles: string[]
  joined_at: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { session } = body

    if (!session) {
      throw createError({
        statusCode: 400,
        message: 'No session provided'
      })
    }

    // Get Discord access token from session
    const providerToken = session.provider_token
    if (!providerToken || typeof providerToken !== 'string') {
      throw createError({
        statusCode: 400,
        message: 'No Discord access token found'
      })
    }

    // Get guild member info to get server name
    const guildMember = await getGuildMemberInfo(providerToken) as GuildMember

    // Update user data in Supabase
    await updateUserData({
      discord_id: session.user.user_metadata.provider_id,
      global_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
      server_name: guildMember.nick || session.user.user_metadata.name,
      last_used_role: 'dps' // Default role, can be updated later
    })

    return { success: true }
  } catch (error) {
    console.error('Update user error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to update user data'
    })
  }
}) 