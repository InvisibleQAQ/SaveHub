"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import type { Article, ArticleTag } from "@/lib/types"
import ArticleHeader from "./articles/article-header"
import ArticleTagSection from "./articles/article-tag-section"
import ArticleContent from "./articles/article-content"
import TagDeleteDialog from "./articles/tag-delete-dialog"

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
      <ArticleHeader article={articleWithTags} openArticle={openArticle} />

      {/* Article Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          {/* Tags section with integrated management */}
          <ArticleTagSection
            tagsToDisplay={tagsToDisplay}
            existingTags={existingTags}
            newTagName={newTagName}
            setNewTagName={setNewTagName}
            newTagColor={newTagColor}
            setNewTagColor={setNewTagColor}
            handleAddTag={handleAddTag}
            handleCreateTag={handleCreateTag}
            handleRemoveTag={handleRemoveTag}
            startEditingTag={startEditingTag}
            saveEditedTag={saveEditedTag}
            confirmDeleteTag={confirmDeleteTag}
            editingTagId={editingTagId}
            editTagName={editTagName}
            setEditTagName={setEditTagName}
            editTagColor={editTagColor}
            setEditTagColor={setEditTagColor}
            colorOptions={colorOptions}
          />

          <ArticleContent article={articleWithTags} />
        </div>
      </ScrollArea>

      {/* Delete Tag Confirmation Dialog */}
      <TagDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        tagToDelete={tagToDelete}
        onDelete={deleteTag}
      />
    </div>
  )
}
