"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Star,
  BookmarkIcon,
  ExternalLink,
  Maximize2,
  Grid,
  MoreHorizontal,
  SendIcon,
  PlusCircle,
  Tag,
  X,
  Edit2,
  Check,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Article, ArticleTag } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ArticleViewProps {
  article: Article
  onUpdateArticle?: (updatedArticle: Article) => void
}

export default function ArticleView({ article, onUpdateArticle }: ArticleViewProps) {
  const [existingTags, setExistingTags] = useState<ArticleTag[]>([])
  const [articleWithTags, setArticleWithTags] = useState<Article>(article)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6") // Default blue color
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editTagName, setEditTagName] = useState("")
  const [editTagColor, setEditTagColor] = useState("")
  const [tagToDelete, setTagToDelete] = useState<ArticleTag | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const newTagInputRef = useRef<HTMLInputElement>(null)
  const editTagInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  // Update local article state when the article prop changes
  useEffect(() => {
    setArticleWithTags(article)
  }, [article])

  // Load existing tags from localStorage on initial load
  useEffect(() => {
    const savedTags = localStorage.getItem("rss-tags")
    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags)
        setExistingTags(parsedTags)
      } catch (e) {
        console.error("Error parsing saved tags", e)
      }
    }
  }, [])

  // Focus input when editing a tag
  useEffect(() => {
    if (editingTagId && editTagInputRef.current) {
      editTagInputRef.current.focus()
    }
  }, [editingTagId])

  // Format the publication date
  const formattedDate = () => {
    try {
      return formatDistanceToNow(new Date(article.publishDate), { addSuffix: true })
    } catch (e) {
      return "Recently"
    }
  }

  // Handle opening the article in a new tab
  const openArticle = () => {
    if (article.link) {
      window.open(article.link, "_blank")
    }
  }

  // Get tags to display (use default "untagged" tag if no tags exist)
  const tagsToDisplay =
    articleWithTags.tags && articleWithTags.tags.length > 0
      ? articleWithTags.tags
      : [{ id: "default", tag_name: "untagged", tag_color: "gray", article_id: articleWithTags.id, attachedAt: "" }]

  // Add a tag to the article
  const handleAddTag = (tag: ArticleTag) => {
    // Check if tag is already added to this article
    if (articleWithTags.tags?.some((t) => t.id === tag.id)) {
      toast({
        title: "Tag Already Added",
        description: `The tag "${tag.tag_name}" is already on this article`,
        variant: "destructive",
      })
      return
    }

    // Create a new tag instance specific to this article
    const newTag: ArticleTag = {
      ...tag,
      article_id: articleWithTags.id,
      attachedAt: new Date().toISOString(),
    }

    // Update the article with the new tag
    const updatedTags = [...(articleWithTags.tags || []), newTag]
    const updatedArticle = { ...articleWithTags, tags: updatedTags }

    // Update local state
    setArticleWithTags(updatedArticle)

    // Notify parent component if callback exists
    if (onUpdateArticle) {
      onUpdateArticle(updatedArticle)
    }

    // Show success toast
    toast({
      title: "Tag Added",
      description: `Added "${tag.tag_name}" tag to this article`,
    })
  }

  // Create a new tag
  const handleCreateTag = (name: string, color: string) => {
    if (!name.trim()) return

    // Create a new tag
    const newTag: ArticleTag = {
      id: `tag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tag_name: name.trim(),
      tag_color: color,
      article_id: "",
      attachedAt: new Date().toISOString(),
    }

    // Add to existing tags
    const updatedExistingTags = [...existingTags, newTag]
    setExistingTags(updatedExistingTags)

    // Save to localStorage
    localStorage.setItem("rss-tags", JSON.stringify(updatedExistingTags))

    // Add the tag to the article
    handleAddTag(newTag)

    // Reset form
    setNewTagName("")
    setNewTagColor("#3b82f6")
  }

  // Remove a tag from the article
  const handleRemoveTag = (tagId: string) => {
    if (tagId === "default") return // Can't remove the default tag

    // Filter out the tag to remove
    const updatedTags = articleWithTags.tags?.filter((tag) => tag.id !== tagId) || []
    const updatedArticle = { ...articleWithTags, tags: updatedTags }

    // Update local state
    setArticleWithTags(updatedArticle)

    // Notify parent component if callback exists
    if (onUpdateArticle) {
      onUpdateArticle(updatedArticle)
    }

    // Show success toast
    toast({
      title: "Tag Removed",
      description: "Tag has been removed from this article",
    })
  }

  // Start editing a tag
  const startEditingTag = (tag: ArticleTag) => {
    setEditingTagId(tag.id)
    setEditTagName(tag.tag_name)
    setEditTagColor(tag.tag_color)
  }

  // Save edited tag
  const saveEditedTag = () => {
    if (!editingTagId || !editTagName.trim()) return

    // Update the tag in existing tags
    const updatedExistingTags = existingTags.map((tag) =>
      tag.id === editingTagId ? { ...tag, tag_name: editTagName.trim(), tag_color: editTagColor } : tag,
    )

    setExistingTags(updatedExistingTags)

    // Save to localStorage
    localStorage.setItem("rss-tags", JSON.stringify(updatedExistingTags))

    // Update the tag in the article if it's attached
    if (articleWithTags.tags) {
      const updatedArticleTags = articleWithTags.tags.map((tag) =>
        tag.id === editingTagId ? { ...tag, tag_name: editTagName.trim(), tag_color: editTagColor } : tag,
      )

      const updatedArticle = { ...articleWithTags, tags: updatedArticleTags }
      setArticleWithTags(updatedArticle)

      // Notify parent component if callback exists
      if (onUpdateArticle) {
        onUpdateArticle(updatedArticle)
      }
    }

    // Reset editing state
    setEditingTagId(null)
    setEditTagName("")
    setEditTagColor("")

    // Show success toast
    toast({
      title: "Tag Updated",
      description: "Tag has been updated successfully",
    })
  }

  // Confirm tag deletion
  const confirmDeleteTag = (tag: ArticleTag) => {
    setTagToDelete(tag)
    setIsDeleteDialogOpen(true)
  }

  // Delete a tag completely
  const deleteTag = () => {
    if (!tagToDelete) return

    // Remove the tag from existing tags
    const updatedExistingTags = existingTags.filter((tag) => tag.id !== tagToDelete.id)
    setExistingTags(updatedExistingTags)

    // Save to localStorage
    localStorage.setItem("rss-tags", JSON.stringify(updatedExistingTags))

    // Remove the tag from the article if it's attached
    if (articleWithTags.tags) {
      const updatedArticleTags = articleWithTags.tags.filter((tag) => tag.id !== tagToDelete.id)
      const updatedArticle = { ...articleWithTags, tags: updatedArticleTags }
      setArticleWithTags(updatedArticle)

      // Notify parent component if callback exists
      if (onUpdateArticle) {
        onUpdateArticle(updatedArticle)
      }
    }

    // Reset delete state
    setTagToDelete(null)
    setIsDeleteDialogOpen(false)

    // Show success toast
    toast({
      title: "Tag Deleted",
      description: "Tag has been permanently deleted",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Article Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-slate-800 dark:bg-slate-700">
            <span className="text-xs font-medium text-white">{articleWithTags.feedTitle.substring(0, 2)}</span>
          </Avatar>
          <span className="font-medium">{articleWithTags.feedTitle}</span>
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

      {/* Article Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{articleWithTags.title}</h1>

          <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
            {articleWithTags.author && <span>{articleWithTags.author}</span>}
            {articleWithTags.author && <span>•</span>}
            <span>{formattedDate()}</span>
          </div>

          {/* Tags section with integrated management */}
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
                          .filter(
                            (tag) =>
                              tag.tag_name.toLowerCase().includes(newTagName.toLowerCase()) &&
                              !articleWithTags.tags?.some((t) => t.id === tag.id),
                          )
                          .map((tag) => (
                            <div
                              key={tag.id}
                              className="flex items-center px-3 py-2 hover:bg-muted cursor-pointer"
                              onClick={() => {
                                handleAddTag(tag)
                                setNewTagName("")
                              }}
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: tag.tag_color }}
                              ></div>
                              <span className="text-sm">{tag.tag_name}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Check if tag already exists */}
                    {(() => {
                      const exactMatchTag =
                        newTagName.trim() !== ""
                          ? existingTags.find(
                              (tag) =>
                                tag.tag_name.toLowerCase() === newTagName.trim().toLowerCase() &&
                                !articleWithTags.tags?.some((t) => t.id === tag.id),
                            )
                          : null

                      const isExactMatch = !!exactMatchTag

                      return (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Tag Color</Label>
                              {isExactMatch && (
                                <span className="text-xs text-muted-foreground">Using existing tag color</span>
                              )}
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
                    })()}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Tags display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {tagsToDisplay.map((tag) => (
                <div key={tag.id} className="relative group">
                  {editingTagId === tag.id ? (
                    <div className="flex items-center space-x-1 bg-background border rounded-md p-1">
                      <Input
                        ref={editTagInputRef}
                        value={editTagName}
                        onChange={(e) => setEditTagName(e.target.value)}
                        className="h-6 text-xs min-w-[100px] max-w-[150px]"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editTagColor }}></div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3">
                          <div className="grid grid-cols-5 gap-2">
                            {colorOptions.map((color) => (
                              <div
                                key={color.value}
                                className={`w-full aspect-square rounded-md cursor-pointer border-2 ${
                                  editTagColor === color.value ? "border-primary" : "border-transparent"
                                }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() => setEditTagColor(color.value)}
                                title={color.name}
                              ></div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={saveEditedTag}>
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
          </div>

          {articleWithTags.image && (
            <div className="mb-6">
              <img
                src={articleWithTags.image || "/placeholder.svg"}
                alt=""
                className="w-full h-auto rounded-lg object-cover max-h-[500px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}

          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: articleWithTags.content }}
          />
        </div>
      </ScrollArea>

      {/* Delete Tag Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag "{tagToDelete?.tag_name}"? This will remove it from all articles
              and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTag}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
