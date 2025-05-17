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

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.description || !body.shortDescription || !body.datetime || !body.image || !body.event_type_id) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Create new event
    const { data: newEvent, error } = await supabase
      .from('events')
      .insert({
        title: body.title,
        description: body.description,
        datetime: new Date(body.datetime).toISOString(),
        image: body.image,
        slug,
        event_type_id: body.event_type_id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return {
      success: true,
      message: 'Event created successfully',
      event: newEvent
    }
  } catch (error) {
    console.error('Error creating event:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create event'
    })
  }
}) 