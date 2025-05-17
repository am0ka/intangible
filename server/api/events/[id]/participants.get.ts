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

interface ParticipantWithUser {
  id: string
  member_id: {
    server_name: string
  }
  role: 'tank' | 'heal' | 'dps'
  class: string
  attended: boolean | null
}

interface FormattedParticipant {
  id: string
  server_name: string
  role: 'tank' | 'heal' | 'dps'
  class: string
  attended: boolean | null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const type = query.type as string

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Event ID is required'
    })
  }

  if (!type) {
    throw createError({
      statusCode: 400,
      message: 'Participant type is required'
    })
  }

  try {
    const { data: participants, error: participantsError } = await supabase
      .from('participations')
      .select(`
        id,
        member_id (
          server_name
        ),
        role,
        class,
        attended
      `)
      .eq('event_id', id)
      .eq('type', type)
      .overrideTypes<ParticipantWithUser[]>()

    if (participantsError) {
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch participants'
      })
    }

    // Transform the data to match the expected format
    const formattedParticipants: FormattedParticipant[] = participants.map(p => ({
      id: p.id,
      server_name: p.member_id.server_name,
      role: p.role,
      class: p.class,
      attended: p.attended
    }))

    return formattedParticipants
  } catch (error) {
    console.error('Error fetching participants:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch participants'
    })
  }
})
