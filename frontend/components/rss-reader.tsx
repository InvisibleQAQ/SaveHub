"use client"

import { useState, useRef, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"

// Import custom hooks
import { useRSSReaderState } from "@/components/state/use-rss-reader-state"

// Import modular components
import Sidebar from "@/components/sidebar/sidebar"
import FeedListColumn from "@/components/feeds/feed-list-column"
import ArticleListColumn from "@/components/articles/article-list-column"
import ArticleView from "@/components/article-view"
import PlaceholderContent from "@/components/placeholder-content"

// Import modals
import FeedImportModal from "@/components/feed-import-modal"
import ListManageModal from "@/components/list-manage-modal"
import AddFeedDialog from "@/components/modals/add-feed-dialog"
import SettingsDialog from "@/components/modals/settings-dialog"

export default function RSSReader() {
  // Use the custom hook for state management
  const rssState = useRSSReaderState()

  // UI state
  const [addFeedOpen, setAddFeedOpen] = useState(false)
  const [importFeedOpen, setImportFeedOpen] = useState(false)
  const [listManageOpen, setListManageOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isMiddleColumnVisible, setIsMiddleColumnVisible] = useState(false)
  const [isHoveringFeedsTab, setIsHoveringFeedsTab] = useState(false)

  // Refs
  const middleColumnRef = useRef<HTMLDivElement>(null)
  const feedsButtonRef = useRef<HTMLButtonElement>(null)

  const handleFeedsTabMouseEnter = () => {
    setIsHoveringFeedsTab(true)
    setIsMiddleColumnVisible(true)
  }

  const handleFeedsTabMouseLeave = () => {
    setIsHoveringFeedsTab(false)
    // Only hide if we're not interacting with the middle column
    if (!middleColumnRef.current?.matches(":hover")) {
      setIsMiddleColumnVisible(false)
    }
  }

  const handleMiddleColumnMouseEnter = () => {
    setIsMiddleColumnVisible(true)
  }

  const handleMiddleColumnMouseLeave = () => {
    // Only hide if we're not hovering over the Feeds tab
    if (!isHoveringFeedsTab) {
      setIsMiddleColumnVisible(false)
    }
  }

  // Show middle column when switching to feeds tab
  useEffect(() => {
    if (rssState.activeTab === "feeds") {
      setIsMiddleColumnVisible(true)
      // Auto-hide after a brief delay if not interacting with it
      const timer = setTimeout(() => {
        if (!middleColumnRef.current?.matches(":hover") && !feedsButtonRef.current?.matches(":hover")) {
          setIsMiddleColumnVisible(false)
        }
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setIsMiddleColumnVisible(false)
    }
  }, [rssState.activeTab])

  // Update the handleImportFeeds function to properly handle the async operation
  const handleImportFeeds = async (feeds: any) => {
    try {
      await rssState.handleImportFeeds(feeds)
    } catch (error) {
      console.error("Error importing feeds:", error)
    }
  }

  // Update the addFeed function to properly handle the async operation
  const addFeed = async (url: string, name: string, listId: string) => {
    try {
      await rssState.addFeed(url, name, listId)
    } catch (error) {
      console.error("Error adding feed:", error)
      throw error
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Main Sidebar */}
      <Sidebar
        activeTab={rssState.activeTab}
        setActiveTab={rssState.setActiveTab}
        sidebarCollapsed={rssState.sidebarCollapsed}
        setSidebarCollapsed={rssState.setSidebarCollapsed}
        setAddFeedOpen={setAddFeedOpen}
        setSettingsOpen={setSettingsOpen}
        feedsCount={rssState.feeds.reduce((acc, feed) => acc + feed.count, 0)}
        handleFeedsTabMouseEnter={handleFeedsTabMouseEnter}
        handleFeedsTabMouseLeave={handleFeedsTabMouseLeave}
        feedsButtonRef={feedsButtonRef}
      />

      {/* Main Content Area */}
      {rssState.activeTab === "feeds" ? (
        <div className="flex flex-1">
          {/* Feed Categories */}
          <FeedListColumn
            lists={rssState.lists}
            selectedList={rssState.selectedList}
            selectedFeed={rssState.selectedFeed}
            isMiddleColumnVisible={isMiddleColumnVisible}
            middleColumnRef={middleColumnRef}
            handleMiddleColumnMouseEnter={handleMiddleColumnMouseEnter}
            handleMiddleColumnMouseLeave={handleMiddleColumnMouseLeave}
            setSettingsOpen={setSettingsOpen}
            setListManageOpen={setListManageOpen}
            setImportFeedOpen={setImportFeedOpen}
            selectFeed={rssState.selectFeed}
            selectList={rssState.selectList}
            toggleListExpanded={rssState.toggleListExpanded}
            startEditingList={rssState.startEditingList}
            saveEditingList={rssState.saveEditingList}
            cancelEditingList={rssState.cancelEditingList}
            deleteList={rssState.deleteList}
            editingListId={rssState.editingListId}
            editingListName={rssState.editingListName}
            setEditingListName={rssState.setEditingListName}
            feedFavicons={rssState.feedFavicons}
          />

          {/* Feed Items */}
          <ArticleListColumn
            viewingListArticles={rssState.viewingListArticles}
            selectedList={rssState.selectedList}
            selectedFeed={rssState.selectedFeed}
            selectedArticle={rssState.selectedArticle}
            articles={rssState.articles}
            listArticles={rssState.listArticles}
            searchQuery={rssState.searchQuery}
            setSearchQuery={rssState.setSearchQuery}
            setSelectedArticle={rssState.setSelectedArticle}
            backToListView={rssState.backToListView}
            isLoading={rssState.isLoading}
            isFetchingListArticles={rssState.isFetchingListArticles}
            feedFavicons={rssState.feedFavicons}
            getCurrentList={rssState.getCurrentList}
            handleUpdate={rssState.handleUpdate}
            isUpdating={rssState.isUpdating}
            markArticleAsRead={rssState.markArticleAsRead}
            markAllAsRead={rssState.markAllAsRead}
          />

          {/* Article Content */}
          <div className="flex-1 overflow-hidden">
            {rssState.selectedArticle ? (
              <ArticleView article={rssState.selectedArticle} onUpdateArticle={rssState.handleUpdateArticle} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Select an article to view</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Placeholder content for other tabs
        <PlaceholderContent activeTab={rssState.activeTab} setActiveTab={rssState.setActiveTab} />
      )}

      {/* Add Feed Dialog */}
      <AddFeedDialog
        open={addFeedOpen}
        onOpenChange={setAddFeedOpen}
        lists={rssState.lists}
        isLoading={rssState.isLoading}
        onAddFeed={addFeed}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        darkMode={rssState.darkMode}
        onToggleDarkMode={rssState.toggleDarkMode}
      />

      {/* Feed Import Modal */}
      <FeedImportModal
        open={importFeedOpen}
        onOpenChange={setImportFeedOpen}
        lists={rssState.lists}
        onImport={handleImportFeeds}
      />

      {/* List Management Modal */}
      <ListManageModal
        open={listManageOpen}
        onOpenChange={setListManageOpen}
        lists={rssState.lists.filter((f) => f.id !== "newsfeed")}
        onAddList={rssState.addList}
        onRenameList={(id, name) => {
          rssState.lists((prev) => prev.map((list) => (list.id === id ? { ...list, name } : list)))
        }}
        onDeleteList={rssState.deleteList}
        onUpdateListAppearance={rssState.updateListAppearance}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
