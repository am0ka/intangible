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

interface EventWithType {
  id: string
  title: string
  description: string
  datetime: string
  image: string
  slug: string
  created_at: string
  updated_at: string
  event_type_id: string
  event_type: {
    dkp: number
  } | null
}

export default defineEventHandler(async () => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*, event_type:event_types(dkp)')
      .order('datetime', { ascending: false })
    
    if (error) {
      throw error
    }

    // Add dkp to the root of each event object
    const eventsWithDkp = (events as EventWithType[]).map(event => ({
      ...event,
      dkp: event.event_type?.dkp || 0
    }))
    
    return eventsWithDkp
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch events'
    })
  }
}) 