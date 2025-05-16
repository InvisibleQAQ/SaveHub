"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FeedList } from "@/lib/types"

interface AddFeedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lists: FeedList[]
  isLoading: boolean
  onAddFeed: (url: string, name: string, listId: string) => Promise<any>
}

export default function AddFeedDialog({ open, onOpenChange, lists, isLoading, onAddFeed }: AddFeedDialogProps) {
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [newFeedName, setNewFeedName] = useState("")
  const [newFeedList, setNewFeedList] = useState("newsfeed")

  const handleAddFeed = async () => {
    if (!newFeedUrl) return

    try {
      await onAddFeed(newFeedUrl, newFeedName, newFeedList)

      // Reset form
      setNewFeedUrl("")
      setNewFeedName("")
      onOpenChange(false)
    } catch (error) {
      alert("Could not add feed. Please check the URL and try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New RSS Feed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Feed URL</label>
            <Input
              placeholder="Enter RSS feed URL..."
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Feed Name (optional)</label>
            <Input
              placeholder="Custom feed name..."
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">List</label>
            <select
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              value={newFeedList}
              onChange={(e) => setNewFeedList(e.target.value)}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddFeed} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Feed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
