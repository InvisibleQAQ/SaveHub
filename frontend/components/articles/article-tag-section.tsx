"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tag, PlusCircle } from "lucide-react"
import TagCreationForm from "./tag-creation-form"
import TagEditForm from "./tag-edit-form"
import TagDisplay from "./tag-display"
import type { ArticleTag } from "@/lib/types"

interface ArticleTagSectionProps {
  tagsToDisplay: ArticleTag[]
  existingTags: ArticleTag[]
  newTagName: string
  setNewTagName: (name: string) => void
  newTagColor: string
  setNewTagColor: (color: string) => void
  handleAddTag: (tag: ArticleTag) => void
  handleCreateTag: (name: string, color: string) => void
  handleRemoveTag: (tagId: string) => void
  startEditingTag: (tag: ArticleTag) => void
  saveEditedTag: () => void
  confirmDeleteTag: (tag: ArticleTag) => void
  editingTagId: string | null
  editTagName: string
  setEditTagName: (name: string) => void
  editTagColor: string
  setEditTagColor: (color: string) => void
  colorOptions: { name: string; value: string }[]
}

export default function ArticleTagSection({
  tagsToDisplay,
  existingTags,
  newTagName,
  setNewTagName,
  newTagColor,
  setNewTagColor,
  handleAddTag,
  handleCreateTag,
  handleRemoveTag,
  startEditingTag,
  saveEditedTag,
  confirmDeleteTag,
  editingTagId,
  editTagName,
  setEditTagName,
  editTagColor,
  setEditTagColor,
  colorOptions,
}: ArticleTagSectionProps) {
  const newTagInputRef = useRef<HTMLInputElement>(null)
  const editTagInputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing a tag
  useEffect(() => {
    if (editingTagId && editTagInputRef.current) {
      editTagInputRef.current.focus()
    }
  }, [editingTagId])

  return (
    <div className="mb-6 bg-muted/30 p-3 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-sm font-medium">Tags</span>
        </div>

        {/* Integrated tag management popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              <PlusCircle className="h-3 w-3 mr-1" />
              New Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Add or Create Tag</h4>
              <div className="space-y-2">
                <Label htmlFor="new-tag-name">Tag Name</Label>
                <Input
                  id="new-tag-name"
                  ref={newTagInputRef}
                  placeholder="Enter tag name..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>

              {/* Auto-suggestions as user types */}
              {newTagName.trim() !== "" && (
                <div className="max-h-32 overflow-y-auto border rounded-md mb-3">
                  {existingTags
                    .filter((tag) => tag.tag_name.toLowerCase().includes(newTagName.toLowerCase()))
                    .map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center px-3 py-2 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          handleAddTag(tag)
                          setNewTagName("")
                        }}
                      >
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.tag_color }}></div>
                        <span className="text-sm">{tag.tag_name}</span>
                      </div>
                    ))}
                </div>
              )}

              <TagCreationForm
                newTagName={newTagName}
                existingTags={existingTags}
                newTagColor={newTagColor}
                setNewTagColor={setNewTagColor}
                colorOptions={colorOptions}
                handleAddTag={handleAddTag}
                handleCreateTag={handleCreateTag}
                setNewTagName={setNewTagName}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mt-3">
        {tagsToDisplay.map((tag) => (
          <div key={tag.id} className="relative group">
            {editingTagId === tag.id ? (
              <TagEditForm
                editTagInputRef={editTagInputRef}
                editTagName={editTagName}
                setEditTagName={setEditTagName}
                editTagColor={editTagColor}
                setEditTagColor={setEditTagColor}
                saveEditedTag={saveEditedTag}
                colorOptions={colorOptions}
              />
            ) : (
              <TagDisplay
                tag={tag}
                handleRemoveTag={handleRemoveTag}
                startEditingTag={startEditingTag}
                confirmDeleteTag={confirmDeleteTag}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
