"use client"

import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { SendIcon, Star, BookmarkIcon, ExternalLink, Maximize2, Grid, MoreHorizontal } from "lucide-react"
import type { Article } from "@/lib/types"

interface ArticleHeaderProps {
  article: Article
  openArticle: () => void
}

export default function ArticleHeader({ article, openArticle }: ArticleHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 bg-slate-800 dark:bg-slate-700">
          <span className="text-xs font-medium text-white">{article.feedTitle.substring(0, 2)}</span>
        </Avatar>
        <span className="font-medium">{article.feedTitle}</span>
      </div>

      <div className="flex space-x-1">
        <Button variant="ghost" size="icon">
          <SendIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Star className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <BookmarkIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={openArticle}>
          <ExternalLink className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Maximize2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Grid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
