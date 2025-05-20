export interface Root {
  "?xml": Xml
  rss: Rss
}

export interface Xml {
  "@_version": string
  "@_encoding": string
}

export interface Rss {
  channel: Channel
  "@_xmlns:atom": string
  "@_xmlns:dc": string
  "@_xmlns:media": string
  "@_version": string
}

export interface Channel {
  title: string
  link: string
  "atom:link": AtomLink
  description: string
  language: string
  copyright: string
  lastBuildDate: string
  pubDate: string
  image: Image
  item: Item[]
}

export interface AtomLink {
  "@_href": string
  "@_rel": string
  "@_type": string
}

export interface Image {
  title: string
  url: string
  link: string
}

export interface Item {
  title: string
  link: string
  guid: Guid
  "atom:link": AtomLink2
  description: string
  "dc:creator": string
  pubDate: string
  "media:content": MediaContent
  category: string
}

export interface Guid {
  "#text": string
  "@_isPermaLink": string
}

export interface AtomLink2 {
  "@_href": string
  "@_rel": string
  "@_type": string
}

export interface MediaContent {
  "@_medium": string
  "@_url": string
}