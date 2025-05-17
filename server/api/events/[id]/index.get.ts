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

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Event ID is required'
      })
    }
    
    const { data: eventDoc, error } = await supabase
      .from('events')
      .select('*, event_type:event_types(dkp)')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        throw createError({
          statusCode: 404,
          message: 'Event not found'
        })
      }
      throw error
    }
    
    // Add dkp to the root of the object
    const eventWithDkp = {
      ...eventDoc,
      dkp: (eventDoc as EventWithType).event_type?.dkp || 0
    }
    
    return eventWithDkp
  } catch (error) {
    console.error('Error fetching event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch event'
    })
  }
}) 