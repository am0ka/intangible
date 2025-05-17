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

export default defineEventHandler(async () => {
  try {
    const { data: eventTypes, error } = await supabase
      .from('event_types')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      throw error
    }
    
    return eventTypes
  } catch (error) {
    console.error('Error fetching event types:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch event types'
    })
  }
}) 