// RSS Reader类型定义

export type Feed = {
  id: string
  title: string
  url: string
  count: number
  lastUpdated: string
  listId?: string
  siteUrl?: string
}

export type FolderIcon = "newspaper" | "headphones" | "image" | "code" | "monitor" | "list" | string

export type FeedList = {
  id: string
  name: string
  count: number
  expanded: boolean
  feeds: Feed[]
  icon?: FolderIcon
  color?: string
}

export type ArticleTag = {
  id: string
  tag_name: string
  tag_color: string
  article_id: string
  attachedAt: string
}

export type Article = {
  id: string
  title: string
  content: string
  link: string
  publishDate: string
  image: string
  author: string
  feedTitle: string
  feedId: string
  tags: ArticleTag[]
  isRead: boolean
} 