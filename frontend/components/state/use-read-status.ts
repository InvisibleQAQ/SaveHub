"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/local-storage"
import { Article } from "./rss-types"

export function useReadStatus() {
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // 从本地存储加载已读文章ID
  useEffect(() => {
    const savedIds = loadFromStorage<string[]>(STORAGE_KEYS.READ_ARTICLES, [])
    if (savedIds) {
      setReadArticleIds(new Set(savedIds))
    }
  }, [])

  // 保存已读文章ID到本地存储
  useEffect(() => {
    if (readArticleIds.size > 0) {
      saveToStorage(STORAGE_KEYS.READ_ARTICLES, Array.from(readArticleIds))
    }
  }, [readArticleIds])

  // 将文章标记为已读
  const markArticleAsRead = (articleId: string) => {
    setReadArticleIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(articleId)
      return newSet
    })
  }

  // 检查文章是否已读
  const isArticleRead = (articleId: string) => {
    return readArticleIds.has(articleId)
  }

  // 将所有文章标记为已读
  const markAllAsRead = (articles: Article[]) => {
    // 获取所有文章ID
    const articleIds = articles.map(article => article.id)

    // 将所有ID添加到已读集合
    setReadArticleIds((prev) => {
      const newSet = new Set(prev)
      articleIds.forEach(id => newSet.add(id))
      return newSet
    })

    // 显示成功提示
    toast({
      title: "标记为已读",
      description: "所有文章已标记为已读",
    })
  }

  return {
    readArticleIds,
    markArticleAsRead,
    isArticleRead,
    markAllAsRead
  }
} 