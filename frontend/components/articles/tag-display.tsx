"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit2, Trash2, X } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { ArticleTag } from "@/lib/types"

interface TagDisplayProps {
  tag: ArticleTag
  handleRemoveTag: (tagId: string) => void
  startEditingTag: (tag: ArticleTag) => void
  confirmDeleteTag: (tag: ArticleTag) => void
}

export default function TagDisplay({ tag, handleRemoveTag, startEditingTag, confirmDeleteTag }: TagDisplayProps) {
  return (
    <Badge
      variant="outline"
      className="text-xs px-2 py-0.5 flex items-center gap-1 group-hover:pr-6"
      style={{
        backgroundColor: tag.tag_color === "gray" ? "transparent" : `${tag.tag_color}20`,
        borderColor: tag.tag_color,
        color: tag.tag_color,
      }}
    >
      {tag.tag_name}
      {tag.id !== "default" && (
        <div className="absolute right-1 flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => startEditingTag(tag)}>
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                Edit Tag
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => confirmDeleteTag(tag)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete Tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <X
            className="h-3 w-3 cursor-pointer hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveTag(tag.id)
            }}
          />
        </div>
      )}
    </Badge>
  )
}
