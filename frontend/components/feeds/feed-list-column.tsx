"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Settings, ListPlus, Upload } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import FeedListItem from "./feed-list-item"
import ListEditForm from "./list-edit-form"
import ListHeader from "./list-header"
import type { Feed, FeedList } from "@/lib/types"

interface FeedListColumnProps {
  lists: FeedList[]
  selectedList: string
  selectedFeed: Feed | null
  isMiddleColumnVisible: boolean
  middleColumnRef: React.RefObject<HTMLDivElement>
  handleMiddleColumnMouseEnter: () => void
  handleMiddleColumnMouseLeave: () => void
  setSettingsOpen: (open: boolean) => void
  setListManageOpen: (open: boolean) => void
  setImportFeedOpen: (open: boolean) => void
  selectFeed: (feed: Feed) => void
  selectList: (listId: string) => void
  toggleListExpanded: (listId: string) => void
  startEditingList: (listId: string, currentName: string) => void
  saveEditingList: () => void
  cancelEditingList: () => void
  deleteList: (listId: string) => void
  editingListId: string | null
  editingListName: string
  setEditingListName: (name: string) => void
  feedFavicons: Record<string, string>
}

export default function FeedListColumn({
  lists,
  selectedList,
  selectedFeed,
  isMiddleColumnVisible,
  middleColumnRef,
  handleMiddleColumnMouseEnter,
  handleMiddleColumnMouseLeave,
  setSettingsOpen,
  setListManageOpen,
  setImportFeedOpen,
  selectFeed,
  selectList,
  toggleListExpanded,
  startEditingList,
  saveEditingList,
  cancelEditingList,
  deleteList,
  editingListId,
  editingListName,
  setEditingListName,
  feedFavicons,
}: FeedListColumnProps) {
  const editInputRef = useRef<HTMLInputElement>(null)

  // Focus input when editing list name
  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingListId])

  return (
    <div
      ref={middleColumnRef}
      className={`${isMiddleColumnVisible ? "w-64" : "w-0"
        } border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 ease-in-out`}
      onMouseEnter={handleMiddleColumnMouseEnter}
      onMouseLeave={handleMiddleColumnMouseLeave}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h2 className="font-semibold">Feeds</h2>
        <div className="flex space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setListManageOpen(true)}
                >
                  <ListPlus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage Lists</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-blue-600"
                  onClick={() => setImportFeedOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import Feeds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-2">
          {/* Lists and Feeds */}
          {lists.map((list) => (
            <div key={list.id} className="mb-1">
              {/* List Header */}
              <div className="flex items-center group">
                {editingListId === list.id ? (
                  <ListEditForm
                    editInputRef={editInputRef}
                    editingListName={editingListName}
                    setEditingListName={setEditingListName}
                    saveEditingList={saveEditingList}
                    cancelEditingList={cancelEditingList}
                  />
                ) : (
                  <ListHeader
                    list={list}
                    selectedList={selectedList}
                    selectList={selectList}
                    toggleListExpanded={toggleListExpanded}
                    startEditingList={startEditingList}
                    deleteList={deleteList}
                    setListManageOpen={setListManageOpen}
                  />
                )}
              </div>

              {/* List Content */}
              {list.expanded && (
                <div className="pl-6 mt-1 space-y-1">
                  {list.feeds && list.feeds.length > 0 ? (
                    list.feeds.map((feed) => (
                      <FeedListItem
                        key={feed.id}
                        feed={feed}
                        isSelected={selectedFeed?.id === feed.id}
                        onSelect={() => selectFeed(feed)}
                        favicon={feedFavicons[feed.id] || ""}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 py-1 px-2">No feeds in this list</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
