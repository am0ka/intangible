import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md'
    }),
    events: defineCollection({
      type: 'page',
      source: 'events/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        datetime: z.date(),
        image: z.string(),
        path: z.string(),
      })
    })
  }
})
