"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import FeedItem from "@/components/feed-item"
import ListArticleItem from "@/components/list-article-item"
import EmptyArticleState from "./empty-article-state"
import ArticleListHeader from "./article-list-header"
import type { Article, Feed, FeedList } from "@/lib/types"

interface ArticleListColumnProps {
  viewingListArticles: boolean
  selectedList: string
  selectedFeed: Feed | null
  selectedArticle: Article | null
  articles: Article[]
  listArticles: Article[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  setSelectedArticle: (article: Article | null) => void
  backToListView: () => void
  isLoading: boolean
  isFetchingListArticles: boolean
  feedFavicons: Record<string, string>
  getCurrentList: () => FeedList | undefined
  handleUpdate: () => void
  isUpdating: boolean
  markArticleAsRead: (articleId: string) => void
  markAllAsRead: () => void // Add this line
}

export default function ArticleListColumn({
  viewingListArticles,
  selectedList,
  selectedFeed,
  selectedArticle,
  articles,
  listArticles,
  searchQuery,
  setSearchQuery,
  setSelectedArticle,
  backToListView,
  isLoading,
  isFetchingListArticles,
  feedFavicons,
  getCurrentList,
  handleUpdate,
  isUpdating,
  markArticleAsRead,
  markAllAsRead, // Add this line
}: ArticleListColumnProps) {
  return (
    <div className="w-96 border-r border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
      {/* Search */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        {/* Feed or List Title */}
        <div className="flex items-center justify-between mb-3">
          {viewingListArticles ? (
            <ArticleListHeader
              title={getCurrentList()?.name || "List"}
              showBackButton={true}
              onBackClick={backToListView}
              onUpdateClick={handleUpdate}
              isUpdating={isUpdating}
              onMarkAllAsRead={markAllAsRead} // Add this line
            />
          ) : selectedFeed ? (
            <ArticleListHeader
              title={selectedFeed.title}
              showBackButton={false}
              onUpdateClick={handleUpdate}
              isUpdating={isUpdating}
              onMarkAllAsRead={markAllAsRead} // Add this line
            />
          ) : (
            <h2 className="font-semibold text-lg truncate w-full">All Articles</h2>
          )}
        </div>

        <div className="flex items-center space-x-1 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5">
          <Search className="h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 h-6 px-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Articles List */}
      <ScrollArea className="h-[calc(100vh-60px)]">
        {isLoading || isFetchingListArticles ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
          </div>
        ) : viewingListArticles ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {listArticles.length > 0 ? (
              listArticles
                .filter((article) =>
                  searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
                )
                .map((article) => (
                  <ListArticleItem
                    key={article.id}
                    article={article}
                    isSelected={selectedArticle?.id === article.id}
                    onClick={() => {
                      markArticleAsRead(article.id)
                      setSelectedArticle(article)
                    }}
                    favicon={feedFavicons[article.feedId] || ""}
                  />
                ))
            ) : (
              <EmptyArticleState />
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {articles
              .filter((article) =>
                searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
              )
              .map((article) => (
                <FeedItem
                  key={article.id}
                  article={article}
                  isSelected={selectedArticle?.id === article.id}
                  onClick={() => {
                    markArticleAsRead(article.id)
                    setSelectedArticle(article)
                  }}
                />
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
