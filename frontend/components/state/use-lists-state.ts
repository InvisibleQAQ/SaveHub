"use client"

import { useState, useEffect } from "react"
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/local-storage"
import { FeedList, Feed, FolderIcon } from "./rss-types"

export function useListsState() {
  const [lists, setLists] = useState<FeedList[]>([
    { id: "newsfeed", name: "Newsfeed", count: 24, expanded: true, feeds: [], icon: "newspaper" },
    {
      id: "design-articles",
      name: "Design Articles & Social",
      count: 3,
      expanded: false,
      feeds: [],
      icon: "image",
      color: "purple",
    },
    { id: "podcasts", name: "Podcasts", count: 17, expanded: false, feeds: [], icon: "headphones", color: "green" },
    { id: "design-news", name: "Design News", count: 2, expanded: false, feeds: [], icon: "newspaper", color: "blue" },
    {
      id: "web-design",
      name: "Web Design, UI & UX",
      count: 1,
      expanded: false,
      feeds: [],
      icon: "code",
      color: "indigo",
    },
    { id: "nvidia", name: "Nvidia", count: 1, expanded: false, feeds: [], icon: "monitor", color: "green" },
  ])
  const [selectedList, setSelectedList] = useState<string>("newsfeed")
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListName, setEditingListName] = useState("")

  // 从本地存储加载列表
  useEffect(() => {
    const savedLists = loadFromStorage<FeedList[]>(STORAGE_KEYS.LISTS)
    if (savedLists) {
      setLists(savedLists)
    } else {
      // 向后兼容：检查旧的文件夹存储（兼容性代码）
      const savedFolders = loadFromStorage<FeedList[]>('rss-folders')
      if (savedFolders) {
        setLists(savedFolders)
      }
    }
  }, [])

  // 保存列表到本地存储
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LISTS, lists)
  }, [lists])

  // 切换列表展开状态
  const toggleListExpanded = (listId: string) => {
    setLists((prev) => prev.map((list) => 
      list.id === listId ? { ...list, expanded: !list.expanded } : list
    ))
  }

  // 开始编辑列表
  const startEditingList = (listId: string, currentName: string) => {
    setEditingListId(listId)
    setEditingListName(currentName)
  }

  // 保存列表编辑
  const saveEditingList = () => {
    if (editingListId && editingListName.trim()) {
      setLists((prev) =>
        prev.map((list) => (list.id === editingListId ? { ...list, name: editingListName.trim() } : list))
      )
    }
    setEditingListId(null)
    setEditingListName("")
  }

  // 取消列表编辑
  const cancelEditingList = () => {
    setEditingListId(null)
    setEditingListName("")
  }

  // 删除列表
  const deleteList = (listId: string) => {
    // 移动订阅源到Newsfeed
    const listToDelete = lists.find((f) => f.id === listId)
    if (listToDelete && listToDelete.feeds && listToDelete.feeds.length > 0) {
      // 更新Newsfeed数量
      setLists((prev) => {
        const feedsToMove = listToDelete.feeds || []

        return prev.map((list) => {
          if (list.id === "newsfeed") {
            return {
              ...list,
              count: list.count + feedsToMove.length,
              feeds: [...(list.feeds || []), ...feedsToMove.map((f) => ({ ...f, listId: "newsfeed" }))]
            }
          }
          return list
        })
      })
    }

    // 移除列表
    setLists((prev) => prev.filter((list) => list.id !== listId))

    // 如果删除的列表是当前选中的，选中Newsfeed
    if (selectedList === listId) {
      setSelectedList("newsfeed")
    }
  }

  // 添加列表
  const addList = (name: string, color?: string, icon?: FolderIcon) => {
    const newList: FeedList = {
      id: `list-${Date.now()}`,
      name,
      count: 0,
      expanded: false,
      feeds: [],
      color,
      icon: icon || "list",
    }

    setLists((prev) => [...prev, newList])
    return newList
  }

  // 更新列表外观
  const updateListAppearance = (listId: string, color?: string, icon?: FolderIcon) => {
    setLists((prev) => prev.map((list) => 
      list.id === listId ? { ...list, color, icon: icon || list.icon } : list
    ))
  }

  // 更新列表中的订阅源
  const updateListFeeds = (listId: string, updatedFeeds: Feed[]) => {
    setLists((prev) => 
      prev.map((list) => 
        list.id === listId 
          ? { ...list, feeds: updatedFeeds, count: updatedFeeds.length } 
          : list
      )
    )
  }

  // 添加订阅源到列表
  const addFeedToList = (listId: string, feed: Feed) => {
    setLists((prev) => 
      prev.map((list) => {
        if (list.id === listId) {
          const feeds = [...list.feeds, feed]
          return {
            ...list,
            feeds,
            count: feeds.length
          }
        }
        return list
      })
    )
  }

  // 获取当前选中的列表
  const getCurrentList = () => {
    return lists.find((list) => list.id === selectedList)
  }

  return {
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
  }
} 