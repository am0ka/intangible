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

interface AttendanceUpdate {
  id: string
  attended: boolean
}

interface ParticipationWithEvent {
  event_id: string
  member_id: string
  event: {
    event_type: {
      dkp: number
    } | null
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { updates } = body as { updates: AttendanceUpdate[] }

    if (!updates || !Array.isArray(updates)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body'
      })
    }

    // Process each attendance update
    for (const update of updates) {
      // Get participation record to get event_id and member_id
      const { data: participation, error: participationError } = await supabase
        .from('participations')
        .select('event_id, member_id, event:events(event_type:event_types(dkp))')
        .eq('id', update.id)
        .single()

      if (participationError) {
        console.error('Error fetching participation:', participationError)
        continue
      }

      const typedParticipation = participation as unknown as ParticipationWithEvent

      // Update attendance status
      const { error: updateError } = await supabase
        .from('participations')
        .update({ attended: update.attended })
        .eq('id', update.id)

      if (updateError) {
        console.error('Error updating attendance:', updateError)
        continue
      }

      // Handle DKP orders based on attendance
      if (update.attended && typedParticipation.event.event_type?.dkp) {
        // Create new DKP order for attended participants
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: typedParticipation.member_id,
            event_id: typedParticipation.event_id,
            dkp: typedParticipation.event.event_type.dkp
          })

        if (orderError) {
          console.error('Error creating DKP order:', orderError)
        }
      } else {
        // Delete existing DKP order for non-attended participants
        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('user_id', typedParticipation.member_id)
          .eq('event_id', typedParticipation.event_id)

        if (deleteError) {
          console.error('Error deleting DKP order:', deleteError)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing attendance updates:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process attendance updates'
    })
  }
}) 