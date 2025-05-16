"use client"

import { formatDistanceToNow } from "date-fns"
import type { Article } from "@/lib/types"

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  // Format the publication date
  const formattedDate = () => {
    try {
      return formatDistanceToNow(new Date(article.publishDate), { addSuffix: true })
    } catch (e) {
      return "Recently"
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
        {article.author && <span>{article.author}</span>}
        {article.author && <span>•</span>}
        <span>{formattedDate()}</span>
      </div>

      {article.image && (
        <div className="mb-6">
          <img
            src={article.image || "/placeholder.svg"}
            alt=""
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  )
}
