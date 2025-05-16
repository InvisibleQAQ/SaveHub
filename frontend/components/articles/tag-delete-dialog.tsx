"use client"

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
import type { ArticleTag } from "@/lib/types"

interface TagDeleteDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  tagToDelete: ArticleTag | null
  onDelete: () => void
}

export default function TagDeleteDialog({ isOpen, setIsOpen, tagToDelete, onDelete }: TagDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the tag "{tagToDelete?.tag_name}"? This will remove it from all articles and
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
