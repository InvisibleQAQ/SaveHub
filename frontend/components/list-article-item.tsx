"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Clock, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/types"

interface ListArticleItemProps {
  article: Article
  isSelected: boolean
  onClick: () => void
  favicon: string
}

export default function ListArticleItem({ article, isSelected, onClick, favicon }: ListArticleItemProps) {
  // Format the publication date
  const formattedDate = () => {
    try {
      return formatDistanceToNow(new Date(article.publishDate), { addSuffix: true })
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
          {favicon ? (
            <img
              src={favicon || "/placeholder.svg"}
              alt={article.feedTitle}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                const iconContainer = e.currentTarget.parentElement
                if (iconContainer) {
                  const icon = document.createElement("span")
                  icon.className = "h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-700"
                  icon.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-3.5 w-3.5 text-slate-500"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                  iconContainer.appendChild(icon)
                }
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
            </div>
          )}
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-1">
            <h3 className="text-sm font-medium truncate text-left">{article.title}</h3>
            <div className="flex items-center mt-1">
              <span className="text-xs text-slate-500 truncate mr-2">{article.feedTitle}</span>
              <div className="flex items-center text-xs text-slate-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formattedDate()}</span>
              </div>
            </div>
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
              <p className="text-xs text-slate-500 line-clamp-3 mt-1 text-left">
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
