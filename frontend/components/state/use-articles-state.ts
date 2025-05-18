"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Article, ArticleTag, Feed } from "./rss-types"

export function useArticlesState(markArticleAsRead: (articleId: string) => void, isArticleRead: (articleId: string) => boolean) {
  const [articles, setArticles] = useState<Article[]>([])
  const [listArticles, setListArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [viewingListArticles, setViewingListArticles] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingListArticles, setIsFetchingListArticles] = useState(false)
  const [tags, setTags] = useState<ArticleTag[]>([])
  const { toast } = useToast()

  // 获取特定列表的文章
  const fetchListArticles = async (listId: string, listFeeds: Feed[]) => {
    setIsFetchingListArticles(true)
    setViewingListArticles(true)
    setSelectedArticle(null)

    if (!listFeeds || listFeeds.length === 0) {
      setListArticles([])
      setIsFetchingListArticles(false)
      return
    }

    try {
      const allArticles: Article[] = []

      // 获取列表中每个订阅源的文章
      for (const feed of listFeeds) {
        try {
          const response = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`)
          if (!response.ok) continue

          const data = await response.json()
          if (data && data.items) {
            const parsedArticles = data.items.map((item: any) => {
              // 为文章生成稳定的ID
              const articleId = item.guid || item.id || 
                `${feed.url}-${item.title}-${item.pubDate || item.published || ""}`

              // 检查文章是否已读
              const isRead = isArticleRead(articleId)

              return {
                id: articleId,
                title: item.title || "无标题",
                content: item.content || item.description || "",
                link: item.link || "",
                publishDate: item.pubDate || item.published || new Date().toISOString(),
                image: item.enclosure?.url || "",
                author: item.author || "未知作者",
                feedTitle: data.title || feed.title || "未知订阅源",
                feedId: feed.id,
                tags: [], // 标签会通过其他方式添加
                isRead: isRead,
              }
            })

            allArticles.push(...parsedArticles)
          }
        } catch (error) {
          console.error(`获取订阅源 ${feed.title} 的文章出错:`, error)
        }
      }

      // 按日期排序（最新的在前）
      allArticles.sort((a, b) => {
        try {
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        } catch (e) {
          return 0
        }
      })

      setListArticles(allArticles)
    } catch (error) {
      console.error("获取列表文章出错:", error)
    } finally {
      setIsFetchingListArticles(false)
    }
  }

  // 获取特定订阅源的文章
  const fetchArticles = async (url: string, feedInfo: Feed) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("获取文章失败")

      const data = await response.json()
      if (data && data.items) {
        const parsedArticles = data.items.map((item: any) => {
          // 为文章生成稳定的ID
          const articleId = item.guid || item.id || 
            `${url}-${item.title}-${item.pubDate || item.published || ""}`

          // 检查文章是否已读
          const isRead = isArticleRead(articleId)

          return {
            id: articleId,
            title: item.title || "无标题",
            content: item.content || item.description || "",
            link: item.link || "",
            publishDate: item.pubDate || item.published || new Date().toISOString(),
            image: item.enclosure?.url || "",
            author: item.author || "未知作者",
            feedTitle: data.title || feedInfo?.title || "未知订阅源",
            feedId: feedInfo?.id || "",
            tags: [], // 标签会通过其他方式添加
            isRead: isRead,
          }
        })
        
        setArticles(parsedArticles)
        setViewingListArticles(false)
        
        if (parsedArticles.length > 0) {
          setSelectedArticle(parsedArticles[0])
        }
      }
    } catch (error) {
      console.error("获取文章出错:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 添加标签到文章
  const addTagToArticle = (articleId: string, tag: Omit<ArticleTag, 'article_id' | 'attachedAt'>) => {
    const newTag: ArticleTag = {
      ...tag,
      article_id: articleId,
      attachedAt: new Date().toISOString()
    }
    
    // 更新全局标签列表
    setTags(prev => [...prev, newTag])
    
    // 更新文章中的标签
    const updateArticleWithTag = (article: Article) => {
      if (article.id === articleId) {
        return {
          ...article,
          tags: [...article.tags, newTag]
        }
      }
      return article
    }
    
    // 更新当前视图中的文章
    if (viewingListArticles) {
      setListArticles(prev => prev.map(updateArticleWithTag))
    } else {
      setArticles(prev => prev.map(updateArticleWithTag))
    }
    
    // 更新选中的文章
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(prev => prev ? {
        ...prev,
        tags: [...prev.tags, newTag]
      } : null)
    }
  }

  // 从文章中移除标签
  const removeTagFromArticle = (articleId: string, tagId: string) => {
    // 更新全局标签列表
    setTags(prev => prev.filter(tag => !(tag.id === tagId && tag.article_id === articleId)))
    
    // 更新文章中的标签
    const updateArticleWithoutTag = (article: Article) => {
      if (article.id === articleId) {
        return {
          ...article,
          tags: article.tags.filter(tag => tag.id !== tagId)
        }
      }
      return article
    }
    
    // 更新当前视图中的文章
    if (viewingListArticles) {
      setListArticles(prev => prev.map(updateArticleWithoutTag))
    } else {
      setArticles(prev => prev.map(updateArticleWithoutTag))
    }
    
    // 更新选中的文章
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(prev => prev ? {
        ...prev,
        tags: prev.tags.filter(tag => tag.id !== tagId)
      } : null)
    }
  }

  // 处理文章更新
  const handleUpdateArticle = (updatedArticle: Article) => {
    if (viewingListArticles) {
      setListArticles(prev => prev.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      ))
    } else {
      setArticles(prev => prev.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      ))
    }

    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle)
    }
  }

  // 返回到列表视图
  const backToListView = () => {
    setViewingListArticles(false)
    setSelectedArticle(null)
  }

  // 获取当前文章列表
  const getCurrentArticles = () => {
    return viewingListArticles ? listArticles : articles
  }

  return {
    articles,
    listArticles,
    selectedArticle,
    viewingListArticles,
    isLoading,
    isFetchingListArticles,
    tags,
    setSelectedArticle,
    fetchArticles,
    fetchListArticles,
    addTagToArticle,
    removeTagFromArticle,
    handleUpdateArticle,
    backToListView,
    getCurrentArticles,
    setTags
  }
} 