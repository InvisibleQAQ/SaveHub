"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, Tag } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ArticleTag } from "@/lib/types"

interface TagSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingTags: ArticleTag[]
  articleTags: ArticleTag[]
  onAddTag: (tag: ArticleTag) => void
  onCreateTag: (name: string, color: string) => void
}

export default function TagSelectorModal({
  open,
  onOpenChange,
  existingTags,
  articleTags,
  onAddTag,
  onCreateTag,
}: TagSelectorModalProps) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6") // Default blue color
  const [activeTab, setActiveTab] = useState<"existing" | "create">("existing")

  // Predefined colors for tag creation
  const colorOptions = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Orange", value: "#f97316" },
    { name: "Gray", value: "#6b7280" },
  ]

  // Check if a tag is already assigned to the article
  const isTagAssigned = (tagId: string) => {
    return articleTags.some((tag) => tag.id === tagId)
  }

  // Handle creating a new tag
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor)
      setNewTagName("")
      setNewTagColor("#3b82f6")
      setActiveTab("existing")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Article Tags</DialogTitle>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "existing" ? "default" : "outline"}
            onClick={() => setActiveTab("existing")}
            className="flex-1"
          >
            Existing Tags
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="flex-1"
          >
            Create New Tag
          </Button>
        </div>

        {activeTab === "existing" ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Select tags to add to this article. Tags already assigned are marked with a checkmark.
            </div>

            {existingTags.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No tags available. Create your first tag!</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveTab("create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tag
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-60">
                <div className="grid grid-cols-2 gap-2">
                  {existingTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`flex items-center justify-between p-2 rounded-md border ${
                        isTagAssigned(tag.id) ? "bg-muted" : "hover:bg-muted/50"
                      } cursor-pointer`}
                      onClick={() => !isTagAssigned(tag.id) && onAddTag(tag)}
                    >
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.tag_color }}></div>
                        <span className="text-sm">{tag.tag_name}</span>
                      </div>
                      {isTagAssigned(tag.id) && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                placeholder="Enter tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tag Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`w-full aspect-square rounded-md cursor-pointer border-2 ${
                      newTagColor === color.value ? "border-primary" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setNewTagColor(color.value)}
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
                    backgroundColor: `${newTagColor}20`,
                    borderColor: newTagColor,
                    color: newTagColor,
                  }}
                >
                  {newTagName || "Tag Preview"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          {activeTab === "create" ? (
            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
              Create Tag
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
