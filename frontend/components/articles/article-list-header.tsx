"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Check } from "lucide-react"

interface ArticleListHeaderProps {
  title: string
  showBackButton: boolean
  onBackClick?: () => void
  onUpdateClick: () => void
  isUpdating: boolean
  onMarkAllAsRead?: () => void // Add this prop
}

export default function ArticleListHeader({
  title,
  showBackButton,
  onBackClick,
  onUpdateClick,
  isUpdating,
  onMarkAllAsRead, // Add this prop
}: ArticleListHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="sm" className="mr-2 h-8 w-8 p-0" onClick={onBackClick} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="font-semibold text-lg truncate">{title}</h2>
      </div>
      <div className="flex items-center space-x-2">
        {onMarkAllAsRead && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onMarkAllAsRead}
            aria-label="Mark all as read"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            <span>Mark all read</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onUpdateClick}
          disabled={isUpdating}
          aria-label="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
