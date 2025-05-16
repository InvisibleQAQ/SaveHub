"use client"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ArticleTag } from "@/lib/types"

interface TagCreationFormProps {
  newTagName: string
  existingTags: ArticleTag[]
  newTagColor: string
  setNewTagColor: (color: string) => void
  colorOptions: { name: string; value: string }[]
  handleAddTag: (tag: ArticleTag) => void
  handleCreateTag: (name: string, color: string) => void
  setNewTagName: (name: string) => void
}

export default function TagCreationForm({
  newTagName,
  existingTags,
  newTagColor,
  setNewTagColor,
  colorOptions,
  handleAddTag,
  handleCreateTag,
  setNewTagName,
}: TagCreationFormProps) {
  // Check if tag already exists
  const exactMatchTag =
    newTagName.trim() !== ""
      ? existingTags.find((tag) => tag.tag_name.toLowerCase() === newTagName.trim().toLowerCase())
      : null

  const isExactMatch = !!exactMatchTag

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Tag Color</Label>
          {isExactMatch && <span className="text-xs text-muted-foreground">Using existing tag color</span>}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <div
              key={color.value}
              className={`w-full aspect-square rounded-md border-2 
                ${isExactMatch ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${newTagColor === color.value && !isExactMatch ? "border-primary" : "border-transparent"}
                ${exactMatchTag && exactMatchTag.tag_color === color.value ? "border-primary" : ""}
              `}
              style={{ backgroundColor: color.value }}
              onClick={() => {
                if (!isExactMatch) {
                  setNewTagColor(color.value)
                }
              }}
              title={color.name}
            ></div>
          ))}
        </div>
      </div>
      <div className="pt-2">
        <Label>Preview</Label>
        <div className="flex items-center mt-2">
          <Badge
            variant="outline"
            className="text-sm px-2 py-1"
            style={{
              backgroundColor: `${isExactMatch ? exactMatchTag.tag_color : newTagColor}20`,
              borderColor: isExactMatch ? exactMatchTag.tag_color : newTagColor,
              color: isExactMatch ? exactMatchTag.tag_color : newTagColor,
            }}
          >
            {newTagName || "Tag Preview"}
          </Badge>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={() => {
          if (isExactMatch) {
            // Add existing tag
            handleAddTag(exactMatchTag)
          } else if (newTagName.trim()) {
            // Create new tag
            handleCreateTag(newTagName, newTagColor)
          }
          setNewTagName("")
        }}
        disabled={!newTagName.trim()}
      >
        {isExactMatch ? "Add Existing Tag" : "Create New Tag"}
      </Button>
    </>
  )
}
