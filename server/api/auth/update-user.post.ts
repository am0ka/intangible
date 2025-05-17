import { getGuildMemberInfo, updateUserData } from '~/server/utils/discord'

const config = useRuntimeConfig()

if (!config.public.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing Supabase configuration')
}

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

    // Get guild member info to get server name and roles
    const guildMember = await getGuildMemberInfo(providerToken) as GuildMember

    // Check if user has Admin role
    const hasAdminRole = guildMember.roles.includes('Admin')

    // Update user data in Supabase
    await updateUserData({
      discord_id: session.user.user_metadata.provider_id,
      global_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
      server_name: guildMember.nick || session.user.user_metadata.name,
      last_used_role: 'dps', // Default role, can be updated later
      role: hasAdminRole || session.user.user_metadata.provider_id === '391167430874890242' ? 'admin' : 'user'
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