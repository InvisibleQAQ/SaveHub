"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Article } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface FeedItemProps {
  article: Article
  isSelected: boolean
  onClick: () => void
}

export default function FeedItem({ article, isSelected, onClick }: FeedItemProps) {
  // Format the publication date
  const formattedDate = () => {
    try {
      return formatDistanceToNow(new Date(article.publishDate), { addSuffix: false })
    } catch (e) {
      return "Recently"
    }
  }

  // Get tags to display (use default "untagged" tag if no tags exist)
  const tagsToDisplay =
    article.tags && article.tags.length > 0
      ? article.tags
      : [{ id: "default", tag_name: "untagged", tag_color: "gray", article_id: article.id, attachedAt: "" }]

  return (
    <div
      className={cn(
        "p-4 cursor-pointer",
        isSelected ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(article.link).hostname}&sz=32`}
            alt={article.feedTitle}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/generic-icon.png"
            }}
          />
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-medium truncate text-left">{article.feedTitle}</h3>
            <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{formattedDate()}</span>
          </div>

          <div className="flex space-x-3">
            {article.image && (
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 text-left">{article.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1 text-left">
                {article.content.replace(/<[^>]*>/g, "")}
              </p>

              {/* Display tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                {tagsToDisplay.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-2 py-0"
                    style={{
                      backgroundColor: tag.tag_color === "gray" ? "transparent" : `${tag.tag_color}20`,
                      borderColor: tag.tag_color,
                      color: tag.tag_color,
                    }}
                  >
                    {tag.tag_name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
