export interface NewsItem {
  title: string
  link: string
  description: string
  pubDate: string
  category: string
  image?: string
}

export interface NewsResponse {
  items: NewsItem[]
} 