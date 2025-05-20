import type { NewsResponse } from '~/types/news'
import type { Root, Item } from '~/types/rss/throneandliberty'
import { XMLParser } from 'fast-xml-parser'

export default defineEventHandler(async () => {
  try {
    const response = await $fetch<string>('https://www.playthroneandliberty.com/en-us/news/rss', {
      responseType: 'text'
    })

    const parser = new XMLParser({
      ignoreAttributes: false
    })

    const result = parser.parse(response) as Root
    const items = result.rss.channel.item.map((item: Item) => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
      category: item.category,
      image: item['media:content']?.['@_url']
    }))

    return { items } as NewsResponse
  } catch (error) {
    console.error('Error fetching news:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch news'
    })
  }
}) 