"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Feed, Article } from "./rss-types"
import { useUIState } from "./use-ui-state"
import { useReadStatus } from "./use-read-status"
import { useListsState } from "./use-lists-state"
import { useFeedsState } from "./use-feeds-state"
import { useArticlesState } from "./use-articles-state"
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/local-storage"

export function useRSSReaderState() {
  const { toast } = useToast()
  
  // 初始化各个子状态管理钩子
  const {
    darkMode,
    activeTab,
    sidebarCollapsed, 
    searchQuery,
    isLoading: uiLoading,
    isUpdating,
    setActiveTab,
    setSidebarCollapsed,
    setSearchQuery,
    setIsLoading,
    setIsUpdating,
    toggleDarkMode
  } = useUIState()
  
  const {
    readArticleIds,
    markArticleAsRead,
    isArticleRead,
    markAllAsRead
  } = useReadStatus()
  
  const {
    lists,
    selectedList,
    editingListId,
    editingListName,
    setSelectedList,
    setEditingListName,
    toggleListExpanded,
    startEditingList,
    saveEditingList,
    cancelEditingList,
    deleteList,
    addList,
    updateListAppearance,
    updateListFeeds,
    addFeedToList,
    getCurrentList
  } = useListsState()
  
  const {
    feeds,
    selectedFeed,
    feedFavicons,
    setSelectedFeed,
    addFeed: addFeedBase,
    updateFeed,
    deleteFeed,
    fetchFavicon,
    importFeeds: importFeedsBase,
    getFeedsByListId
  } = useFeedsState()
  
  const {
    articles,
    listArticles,
    selectedArticle,
    viewingListArticles,
    isLoading: articlesLoading,
    isFetchingListArticles,
    tags,
    setSelectedArticle,
    fetchArticles: fetchArticlesBase,
    fetchListArticles: fetchListArticlesBase,
    addTagToArticle,
    removeTagFromArticle,
    handleUpdateArticle,
    backToListView,
    getCurrentArticles,
    setTags
  } = useArticlesState(markArticleAsRead, isArticleRead)

  // 从本地存储加载标签
  useEffect(() => {
    const savedTags = loadFromStorage(STORAGE_KEYS.TAGS, [])
    if (savedTags && savedTags.length > 0) {
      setTags(savedTags)
    } else {
      // 如果没有保存的标签，初始化一些示例标签
      const sampleTags = [
        {
          id: "tag-technology",
          tag_name: "科技",
          tag_color: "#3b82f6",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
        {
          id: "tag-news",
          tag_name: "新闻",
          tag_color: "#10b981",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
        {
          id: "tag-important",
          tag_name: "重要",
          tag_color: "#ef4444",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
      ]
      setTags(sampleTags)
      saveToStorage(STORAGE_KEYS.TAGS, sampleTags)
    }
  }, [])

  // 保存标签到本地存储
  useEffect(() => {
    if (tags.length > 0) {
      saveToStorage(STORAGE_KEYS.TAGS, tags)
    }
  }, [tags])

  // 同步lists中的feeds和全局feeds
  useEffect(() => {
    lists.forEach(list => {
      if (!list.feeds || list.feeds.length === 0) {
        const listFeeds = getFeedsByListId(list.id)
        if (listFeeds.length > 0) {
          updateListFeeds(list.id, listFeeds)
        }
      }
    })
  }, [feeds, lists])

  // 获取文章（扩展基础方法）
  const fetchArticles = async (url: string) => {
    if (!selectedFeed) return
    await fetchArticlesBase(url, selectedFeed)
  }

  // 获取列表文章（扩展基础方法）
  const fetchListArticles = async (listId: string) => {
    const list = lists.find(l => l.id === listId)
    if (!list) return
    
    setSelectedFeed(null)
    const listFeeds = list.feeds.length > 0 ? list.feeds : getFeedsByListId(listId)
    await fetchListArticlesBase(listId, listFeeds)
  }

  // 添加订阅源（扩展基础方法）
  const addFeed = async (url: string, name: string, listId: string) => {
    if (!url) return

    setIsLoading(true)
    try {
      const newFeed = await addFeedBase(url, name, listId)
      if (newFeed) {
        // 更新列表计数和列表中的订阅源
        addFeedToList(listId, newFeed)
        setSelectedFeed(newFeed)
        setSelectedList(listId)
      }
      return newFeed
    } catch (error) {
      console.error("添加订阅源出错:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // 选择订阅源
  const selectFeed = (feed: Feed) => {
    setSelectedFeed(feed)
    setSelectedList(feed.listId || "newsfeed")
    fetchArticles(feed.url)
  }

  // 选择列表
  const selectList = (listId: string) => {
    setSelectedList(listId)
    fetchListArticles(listId)
  }

  // 处理更新
  const handleUpdate = async () => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      if (viewingListArticles) {
        // 更新当前列表中的所有文章
        await fetchListArticles(selectedList)
        // 显示成功提示
        toast({
          title: "更新成功",
          description: `${getCurrentList()?.name || "列表"}文章已刷新。`,
        })
      } else if (selectedFeed) {
        // 更新单个订阅源的文章
        await fetchArticles(selectedFeed.url)
        // 显示成功提示
        toast({
          title: "更新成功",
          description: `${selectedFeed.title}文章已刷新。`,
        })
      }
    } catch (error) {
      console.error("更新文章出错:", error)
      // 显示错误提示
      toast({
        title: "更新失败",
        description: "更新文章时出现问题。请重试。",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // 导入订阅源（扩展基础方法）
  const handleImportFeeds = (importedFeeds: Feed[]) => {
    // 导入订阅源
    const addedFeeds = importFeedsBase(importedFeeds)
    
    // 将订阅源添加到对应的列表
    const feedsByList: Record<string, Feed[]> = {}
    addedFeeds.forEach((feed) => {
      const listId = feed.listId || "newsfeed"
      if (!feedsByList[listId]) {
        feedsByList[listId] = []
      }
      feedsByList[listId].push(feed)
    })

    // 更新每个列表
    Object.entries(feedsByList).forEach(([listId, listFeeds]) => {
      const list = lists.find(l => l.id === listId)
      if (list) {
        const updatedFeeds = [...list.feeds, ...listFeeds]
        updateListFeeds(listId, updatedFeeds)
      }
    })
  }

  // 将全局markAllAsRead方法与文章列表集成
  const markAllArticlesAsRead = () => {
    const currentArticles = getCurrentArticles()
    markAllAsRead(currentArticles)
  }

  // 合并isLoading状态
  const isLoading = uiLoading || articlesLoading

  return {
    // 状态
    feeds,
    lists,
    articles,
    listArticles,
    selectedFeed,
    selectedList,
    viewingListArticles,
    selectedArticle,
    isLoading,
    searchQuery,
    darkMode,
    activeTab,
    sidebarCollapsed,
    editingListId,
    editingListName,
    feedFavicons,
    isFetchingListArticles,
    tags,
    isUpdating,
    readArticleIds,

    // 设置器
    setSearchQuery,
    setSelectedArticle,
    setActiveTab,
    setSidebarCollapsed,
    setEditingListName,

    // 动作
    addFeed,
    toggleDarkMode,
    selectFeed,
    selectList,
    toggleListExpanded,
    startEditingList,
    saveEditingList,
    cancelEditingList,
    deleteList,
    addList,
    updateListAppearance,
    handleImportFeeds,
    getCurrentList,
    backToListView,
    handleUpdateArticle,
    handleUpdate,
    fetchArticles,
    fetchListArticles,
    markArticleAsRead,
    markAllAsRead: markAllArticlesAsRead,
    isArticleRead,
    addTagToArticle,
    removeTagFromArticle
  }
}
