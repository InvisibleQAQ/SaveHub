"use client"

import { useState, useEffect } from "react"
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/local-storage"
import { Feed } from "./rss-types"
import { getFaviconUrl, extractDomainFromUrl } from "./utils/helpers"

export function useFeedsState() {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null)
  const [feedFavicons, setFeedFavicons] = useState<Record<string, string>>({})
  
  // 从本地存储加载订阅源
  useEffect(() => {
    const savedFeeds = loadFromStorage<Feed[]>(STORAGE_KEYS.FEEDS, [])
    if (savedFeeds && savedFeeds.length > 0) {
      // 兼容：转换任何folderId为listId
      const updatedFeeds = savedFeeds.map((feed: any) => {
        if (feed.folderId && !feed.listId) {
          return { ...feed, listId: feed.folderId }
        }
        return feed
      })
      setFeeds(updatedFeeds)
    }
  }, [])

  // 从本地存储加载favicon
  useEffect(() => {
    const savedFavicons = loadFromStorage<Record<string, string>>(STORAGE_KEYS.FAVICONS, {})
    if (savedFavicons && Object.keys(savedFavicons).length > 0) {
      setFeedFavicons(savedFavicons)
    }
  }, [])

  // 保存订阅源到本地存储
  useEffect(() => {
    if (feeds.length > 0) {
      saveToStorage(STORAGE_KEYS.FEEDS, feeds)
    }
  }, [feeds])

  // 保存favicon到本地存储
  useEffect(() => {
    if (Object.keys(feedFavicons).length > 0) {
      saveToStorage(STORAGE_KEYS.FAVICONS, feedFavicons)
    }
  }, [feedFavicons])

  // 添加订阅源
  const addFeed = async (url: string, name: string, listId: string) => {
    if (!url) return null

    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("获取订阅源失败")

      const data = await response.json()
      if (!data) throw new Error("无效的订阅源数据")

      const newFeed: Feed = {
        id: `feed-${Date.now()}`,
        title: name || data.title || "未命名订阅源",
        url: url,
        count: data.items?.length || 0,
        lastUpdated: new Date().toISOString(),
        listId: listId,
        siteUrl: data.link || extractDomainFromUrl(url),
      }

      setFeeds((prev) => [...prev, newFeed])

      // 尝试获取favicon
      if (newFeed.siteUrl) {
        fetchFavicon(newFeed.id, newFeed.siteUrl)
      }

      return newFeed
    } catch (error) {
      console.error("添加订阅源出错:", error)
      throw error
    }
  }

  // 获取favicon
  const fetchFavicon = async (feedId: string, siteUrl: string) => {
    try {
      const faviconUrl = getFaviconUrl(siteUrl)
      if (!faviconUrl) return

      // 存储favicon URL
      setFeedFavicons((prev) => ({
        ...prev,
        [feedId]: faviconUrl,
      }))
    } catch (error) {
      console.error("获取favicon出错:", error)
    }
  }

  // 更新订阅源
  const updateFeed = (updatedFeed: Feed) => {
    setFeeds((prev) => prev.map((feed) => (feed.id === updatedFeed.id ? updatedFeed : feed)))
  }

  // 删除订阅源
  const deleteFeed = (feedId: string) => {
    setFeeds((prev) => prev.filter((feed) => feed.id !== feedId))
    if (selectedFeed?.id === feedId) {
      setSelectedFeed(null)
    }
  }

  // 导入订阅源
  const importFeeds = (importedFeeds: Feed[]) => {
    // 添加导入的订阅源到订阅源列表
    setFeeds((prev) => [...prev, ...importedFeeds])

    // 获取导入的所有订阅源的favicon
    importedFeeds.forEach((feed) => {
      if (feed.siteUrl) {
        fetchFavicon(feed.id, feed.siteUrl)
      }
    })

    return importedFeeds
  }
  
  // 获取特定列表中的所有订阅源
  const getFeedsByListId = (listId: string) => {
    return feeds.filter(feed => feed.listId === listId)
  }

  return {
    feeds,
    selectedFeed,
    feedFavicons,
    setSelectedFeed,
    addFeed,
    updateFeed,
    deleteFeed,
    fetchFavicon,
    importFeeds,
    getFeedsByListId
  }
} 