export type FolderIcon =
  | "folder"
  | "folder-open"
  | "newspaper"
  | "bookmark"
  | "rss"
  | "globe"
  | "file"
  | "music"
  | "video"
  | "image"
  | "package"
  | "star"
  | "heart"
  | "coffee"
  | "zap"
  | "book"
  | "briefcase"
  | "camera"
  | "code"
  | "database"
  | "film"
  | "headphones"
  | "mail"
  | "monitor"
  | "shopping-cart"
  | "smartphone"
  | "truck"
  | "tv"
  | "list"
  | "list-checks"
  | "list-ordered"
  | "list-todo"
  | "list-tree"
  | "layout-list"
  | "check-square"
  | "check-circle"
  | "check"
  | "tag"
  | "tags"
  | "bookmark-plus"
  | "bookmark-check"
  | "layers"
  | "layers-2"
  | "layers-3";

export interface Feed {
  id: string;
  title: string;
  url: string;
  count: number;
  lastUpdated: string;
  listId?: string;
  siteUrl?: string;
}

export interface FeedList {
  id: string;
  name: string;
  count: number;
  expanded: boolean;
  feeds?: Feed[];
  color?: string;
  icon?: FolderIcon;
}

export interface FeedFolder {
  id: string;
  name: string;
  count: number;
  expanded: boolean;
  feeds?: Feed[];
  color?: string;
  icon?: FolderIcon;
}

export interface ArticleTag {
  id: string;
  tag_name: string;
  tag_color: string;
  article_id: string;
  attachedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  link: string;
  publishDate: string;
  image: string;
  author: string;
  feedTitle: string;
  tags?: ArticleTag[];
  isRead: boolean;
}
