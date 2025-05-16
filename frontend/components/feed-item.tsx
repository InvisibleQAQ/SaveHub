"use client"
import type { Article } from "@/lib/types"

interface FeedItemProps {
  article: Article
  isSelected: boolean
  onClick: () => void
}

export default function FeedItem({ article, isSelected, onClick }: FeedItemProps) {
  // Format the publish date to show relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays <= 0) {
        return "Today"
      } else if (diffDays === 1) {
        return "Yesterday"
      } else if (diffDays < 30) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString()
      }
    } catch (e) {
      return "Unknown date"
    }
  }

  return (
    <div
      className={`p-4 cursor-pointer transition-colors ${isSelected
          ? "bg-slate-100 dark:bg-slate-800/60 border-l-4 border-l-purple-500"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
        }`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-1 relative pr-8">
          <div className="flex items-center gap-2">
            {/* Add unread indicator */}
            {!article.isRead && (
              <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" aria-label="Unread article" />
            )}
            <h3
              className={`font-medium text-sm ${article.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-slate-200"}`}
            >
              {article.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {article.content?.replace(/<[^>]*>/g, "") || "No description available"}
          </p>
          <div className="flex items-center mt-2 gap-2">
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: `${tag.tag_color}30`, color: tag.tag_color }}
                  >
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 absolute top-0 right-0">
            {formatDate(article.publishDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
