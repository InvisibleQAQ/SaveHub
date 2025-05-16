"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import type { Feed } from "@/lib/types"

interface FeedListItemProps {
  feed: Feed
  isSelected: boolean
  onSelect: () => void
  favicon: string
}

export default function FeedListItem({ feed, isSelected, onSelect, favicon }: FeedListItemProps) {
  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      className="w-full justify-start px-2 py-1.5 h-auto text-sm"
      onClick={onSelect}
    >
      <div className="flex items-center w-full">
        {favicon ? (
          <img
            src={favicon || "/placeholder.svg"}
            alt=""
            className="h-4 w-4 mr-2 rounded-sm"
            onError={(e) => {
              // If favicon fails to load, show default icon
              e.currentTarget.style.display = "none"
              const iconContainer = e.currentTarget.parentElement
              if (iconContainer) {
                const icon = document.createElement("span")
                icon.className = "h-4 w-4 mr-2 flex items-center justify-center"
                icon.innerHTML =
                  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-3.5 w-3.5 text-slate-400"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                iconContainer.insertBefore(icon, e.currentTarget)
              }
            }}
          />
        ) : (
          <Globe className="h-3.5 w-3.5 mr-2 text-slate-400" />
        )}
        <span className="truncate text-left flex-1">{feed.title}</span>
        {feed.count > 0 && <span className="ml-auto text-xs text-slate-500">{feed.count}</span>}
      </div>
    </Button>
  )
}
