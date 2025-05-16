"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Feed, Article, FeedList, FolderIcon, ArticleTag } from "@/lib/types"

export function useRSSReaderState() {
  const [feeds, setFeeds] = useState<Feed[]>([])
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
  const [articles, setArticles] = useState<Article[]>([])
  const [listArticles, setListArticles] = useState<Article[]>([])
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null)
  const [selectedList, setSelectedList] = useState<string>("newsfeed")
  const [viewingListArticles, setViewingListArticles] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("feeds")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListName, setEditingListName] = useState("")
  const [feedFavicons, setFeedFavicons] = useState<Record<string, string>>({})
  const [isFetchingListArticles, setIsFetchingListArticles] = useState(false)
  const [tags, setTags] = useState<ArticleTag[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  // Add a new state for tracking read article IDs
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(new Set())

  // Load feeds and lists from localStorage on initial load
  useEffect(() => {
    const savedFeeds = localStorage.getItem("rss-feeds")
    const savedLists = localStorage.getItem("rss-lists")
    const savedFavicons = localStorage.getItem("rss-favicons")
    const savedTags = localStorage.getItem("rss-tags")

    if (savedFeeds) {
      try {
        const parsedFeeds = JSON.parse(savedFeeds)
        // Convert any folderId to listId for backward compatibility
        const updatedFeeds = parsedFeeds.map((feed: any) => {
          if (feed.folderId && !feed.listId) {
            return { ...feed, listId: feed.folderId }
          }
          return feed
        })
        setFeeds(updatedFeeds)
      } catch (e) {
        console.error("Error parsing saved feeds", e)
      }
    }

    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists)
        setLists(parsedLists)
      } catch (e) {
        console.error("Error parsing saved lists", e)
      }
    } else {
      // If no saved lists, check for saved folders for backward compatibility
      const savedFolders = localStorage.getItem("rss-folders")
      if (savedFolders) {
        try {
          const parsedFolders = JSON.parse(savedFolders)
          setLists(parsedFolders)
        } catch (e) {
          console.error("Error parsing saved folders", e)
        }
      }
    }

    if (savedFavicons) {
      try {
        const parsedFavicons = JSON.parse(savedFavicons)
        setFeedFavicons(parsedFavicons)
      } catch (e) {
        console.error("Error parsing saved favicons", e)
      }
    }

    if (savedTags) {
      try {
        const parsedTags = JSON.parse(savedTags)
        setTags(parsedTags)
      } catch (e) {
        console.error("Error parsing saved tags", e)
      }
    } else {
      // Initialize with some sample tags if none exist
      const sampleTags: ArticleTag[] = [
        {
          id: "tag-technology",
          tag_name: "Technology",
          tag_color: "#3b82f6",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
        {
          id: "tag-news",
          tag_name: "News",
          tag_color: "#10b981",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
        {
          id: "tag-important",
          tag_name: "Important",
          tag_color: "#ef4444",
          article_id: "",
          attachedAt: new Date().toISOString(),
        },
      ]
      setTags(sampleTags)
      localStorage.setItem("rss-tags", JSON.stringify(sampleTags))
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem("rss-dark-mode")
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true")
      if (savedDarkMode === "true") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // Save feeds to localStorage when changed
  useEffect(() => {
    if (feeds.length > 0) {
      localStorage.setItem("rss-feeds", JSON.stringify(feeds))
    }
  }, [feeds])

  // Save lists to localStorage when changed
  useEffect(() => {
    localStorage.setItem("rss-lists", JSON.stringify(lists))
  }, [lists])

  // Save favicons to localStorage when changed
  useEffect(() => {
    if (Object.keys(feedFavicons).length > 0) {
      localStorage.setItem("rss-favicons", JSON.stringify(feedFavicons))
    }
  }, [feedFavicons])

  // Save tags to localStorage when changed
  useEffect(() => {
    if (tags.length > 0) {
      localStorage.setItem("rss-tags", JSON.stringify(tags))
    }
  }, [tags])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("rss-dark-mode", darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Load read article IDs from localStorage on initial load
  useEffect(() => {
    const savedReadArticleIds = localStorage.getItem("rss-read-articles")
    if (savedReadArticleIds) {
      try {
        const parsedReadArticleIds = JSON.parse(savedReadArticleIds)
        setReadArticleIds(new Set(parsedReadArticleIds))
      } catch (e) {
        console.error("Error parsing saved read article IDs", e)
      }
    }
  }, [])

  // Save read article IDs to localStorage when changed
  useEffect(() => {
    if (readArticleIds.size > 0) {
      localStorage.setItem("rss-read-articles", JSON.stringify(Array.from(readArticleIds)))
    }
  }, [readArticleIds])

  // Fetch articles when a feed is selected
  useEffect(() => {
    if (selectedFeed) {
      fetchArticles(selectedFeed.url)
      setViewingListArticles(false)
    }
  }, [selectedFeed])

  // Modify the fetchArticles function to check if articles have been read
  const fetchArticles = async (url: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("Failed to fetch articles")

      const data = await response.json()
      if (data && data.items) {
        const parsedArticles = data.items.map((item: any, index: number) => {
          // Generate a stable ID for the article
          const articleId = item.guid || item.id || `${url}-${item.title}-${item.pubDate || item.published || ""}`

          // Check if this article has been read before
          const isRead = readArticleIds.has(articleId)

          // Generate some sample tags for demonstration
          const sampleTags =
            index % 3 === 0
              ? [
                {
                  id: `tag-${Date.now()}-1`,
                  tag_name: "Technology",
                  tag_color: "#3b82f6",
                  article_id: articleId,
                  attachedAt: new Date().toISOString(),
                },
                {
                  id: `tag-${Date.now()}-2`,
                  tag_name: "News",
                  tag_color: "#10b981",
                  article_id: articleId,
                  attachedAt: new Date().toISOString(),
                },
              ]
              : index % 3 === 1
                ? [
                  {
                    id: `tag-${Date.now()}-3`,
                    tag_name: "Important",
                    tag_color: "#ef4444",
                    article_id: articleId,
                    attachedAt: new Date().toISOString(),
                  },
                ]
                : []

          return {
            id: articleId,
            title: item.title || "Untitled",
            content: item.content || item.description || "",
            link: item.link || "",
            publishDate: item.pubDate || item.published || new Date().toISOString(),
            image: item.enclosure?.url || "",
            author: item.author || "Unknown",
            feedTitle: data.title || selectedFeed?.title || "Unknown Feed",
            feedId: selectedFeed?.id || "",
            tags: sampleTags,
            isRead: isRead,
          }
        })
        setArticles(parsedArticles)
        if (parsedArticles.length > 0) {
          setSelectedArticle(parsedArticles[0])
        }

        // Update feed with site URL if available
        if (data.link && selectedFeed) {
          const siteUrl = data.link
          setFeeds((prev) => prev.map((feed) => (feed.id === selectedFeed.id ? { ...feed, siteUrl } : feed)))

          // Fetch favicon if we don't have it yet
          if (selectedFeed && !feedFavicons[selectedFeed.id]) {
            fetchFavicon(selectedFeed.id, siteUrl)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Similarly modify the fetchListArticles function to check read status
  const fetchListArticles = async (listId: string) => {
    setIsFetchingListArticles(true)
    setViewingListArticles(true)
    setSelectedFeed(null)
    setSelectedArticle(null)

    const list = lists.find((f) => f.id === listId)
    if (!list || !list.feeds || list.feeds.length === 0) {
      setListArticles([])
      setIsFetchingListArticles(false)
      return
    }

    try {
      const allArticles: Article[] = []

      // Fetch articles from each feed in the list
      for (const feed of list.feeds) {
        try {
          const response = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`)
          if (!response.ok) continue

          const data = await response.json()
          if (data && data.items) {
            const parsedArticles = data.items.map((item: any, index: number) => {
              // Generate a stable ID for the article
              const articleId =
                item.guid || item.id || `${feed.url}-${item.title}-${item.pubDate || item.published || ""}`

              // Check if this article has been read before
              const isRead = readArticleIds.has(articleId)

              // Generate some sample tags for demonstration
              const sampleTags =
                index % 3 === 0
                  ? [
                    {
                      id: `tag-${Date.now()}-1`,
                      tag_name: "Technology",
                      tag_color: "#3b82f6",
                      article_id: articleId,
                      attachedAt: new Date().toISOString(),
                    },
                    {
                      id: `tag-${Date.now()}-2`,
                      tag_name: "News",
                      tag_color: "#10b981",
                      article_id: articleId,
                      attachedAt: new Date().toISOString(),
                    },
                  ]
                  : index % 3 === 1
                    ? [
                      {
                        id: `tag-${Date.now()}-3`,
                        tag_name: "Important",
                        tag_color: "#ef4444",
                        article_id: articleId,
                        attachedAt: new Date().toISOString(),
                      },
                    ]
                    : []

              return {
                id: articleId,
                title: item.title || "Untitled",
                content: item.content || item.description || "",
                link: item.link || "",
                publishDate: item.pubDate || item.published || new Date().toISOString(),
                image: item.enclosure?.url || "",
                author: item.author || "Unknown",
                feedTitle: data.title || feed.title || "Unknown Feed",
                feedId: feed.id,
                tags: sampleTags,
                isRead: isRead,
              }
            })

            allArticles.push(...parsedArticles)

            // Update feed with site URL if available
            if (data.link) {
              const siteUrl = data.link
              setFeeds((prev) => prev.map((f) => (f.id === feed.id ? { ...f, siteUrl } : f)))

              // Fetch favicon if we don't have it yet
              if (!feedFavicons[feed.id]) {
                fetchFavicon(feed.id, siteUrl)
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching articles for feed ${feed.title}:`, error)
        }
      }

      // Sort all articles by date (newest first)
      allArticles.sort((a, b) => {
        try {
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        } catch (e) {
          return 0
        }
      })

      setListArticles(allArticles)
    } catch (error) {
      console.error("Error fetching list articles:", error)
    } finally {
      setIsFetchingListArticles(false)
    }
  }

  const fetchFavicon = async (feedId: string, siteUrl: string) => {
    try {
      // Try to get favicon from Google's favicon service
      const domain = extractDomainFromUrl(siteUrl)
      if (!domain) return

      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

      // Store the favicon URL
      setFeedFavicons((prev) => ({
        ...prev,
        [feedId]: faviconUrl,
      }))
    } catch (error) {
      console.error("Error fetching favicon:", error)
    }
  }

  const extractDomainFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch (e) {
      return ""
    }
  }

  const addFeed = async (url: string, name: string, listId: string) => {
    if (!url) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("Failed to fetch feed")

      const data = await response.json()
      if (!data) throw new Error("Invalid feed data")

      const newFeed: Feed = {
        id: `feed-${Date.now()}`,
        title: name || data.title || "Untitled Feed",
        url: url,
        count: data.items?.length || 0,
        lastUpdated: new Date().toISOString(),
        listId: listId,
        siteUrl: data.link || extractDomainFromUrl(url),
      }

      setFeeds((prev) => [...prev, newFeed])

      // Update list counts
      setLists((prev) => {
        return prev.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              count: list.count + 1,
              feeds: [...(list.feeds || []), newFeed],
            }
          }
          return list
        })
      })

      // Try to fetch favicon
      if (newFeed.siteUrl) {
        fetchFavicon(newFeed.id, newFeed.siteUrl)
      }

      setSelectedFeed(newFeed)
      setSelectedList(listId)

      return newFeed
    } catch (error) {
      console.error("Error adding feed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const selectFeed = (feed: Feed) => {
    setSelectedFeed(feed)
    setSelectedList(feed.listId || "newsfeed")
    setViewingListArticles(false)
  }

  const selectList = (listId: string) => {
    setSelectedList(listId)
    fetchListArticles(listId)
  }

  const toggleListExpanded = (listId: string) => {
    setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, expanded: !list.expanded } : list)))
  }

  const startEditingList = (listId: string, currentName: string) => {
    setEditingListId(listId)
    setEditingListName(currentName)
  }

  const saveEditingList = () => {
    if (editingListId && editingListName.trim()) {
      setLists((prev) =>
        prev.map((list) => (list.id === editingListId ? { ...list, name: editingListName.trim() } : list)),
      )
    }
    setEditingListId(null)
    setEditingListName("")
  }

  const cancelEditingList = () => {
    setEditingListId(null)
    setEditingListName("")
  }

  const deleteList = (listId: string) => {
    // Move feeds to Newsfeed
    const listToDelete = lists.find((f) => f.id === listId)
    if (listToDelete && listToDelete.feeds && listToDelete.feeds.length > 0) {
      setFeeds((prev) => prev.map((feed) => (feed.listId === listId ? { ...feed, listId: "newsfeed" } : feed)))

      // Update Newsfeed count
      setLists((prev) => {
        const newsfeedList = prev.find((f) => f.id === "newsfeed")
        const feedsToMove = listToDelete.feeds || []

        return prev.map((list) => {
          if (list.id === "newsfeed") {
            return {
              ...list,
              count: list.count + feedsToMove.length,
              feeds: [...(list.feeds || []), ...feedsToMove.map((f) => ({ ...f, listId: "newsfeed" }))],
            }
          }
          return list
        })
      })
    }

    // Remove the list
    setLists((prev) => prev.filter((list) => list.id !== listId))

    // If the deleted list was selected, select Newsfeed
    if (selectedList === listId) {
      setSelectedList("newsfeed")
    }
  }

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

  const updateListAppearance = (listId: string, color?: string, icon?: FolderIcon) => {
    setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, color, icon: icon || list.icon } : list)))
  }

  const handleImportFeeds = (importedFeeds: Feed[]) => {
    // Add imported feeds to the feeds list
    setFeeds((prev) => [...prev, ...importedFeeds])

    // Update list counts and add feeds to lists
    setLists((prev) => {
      const updatedLists = [...prev]

      // Group imported feeds by list
      const feedsByList: Record<string, Feed[]> = {}
      importedFeeds.forEach((feed) => {
        if (!feedsByList[feed.listId]) {
          feedsByList[feed.listId] = []
        }
        feedsByList[feed.listId].push(feed)
      })

      // Update each list
      return updatedLists.map((list) => {
        if (feedsByList[list.id]) {
          return {
            ...list,
            count: list.count + feedsByList[list.id].length,
            feeds: [...(list.feeds || []), ...feedsByList[list.id]],
          }
        }
        return list
      })
    })

    // Fetch favicons for all imported feeds
    importedFeeds.forEach((feed) => {
      if (feed.siteUrl) {
        fetchFavicon(feed.id, feed.siteUrl)
      }
    })
  }

  const getCurrentList = () => {
    return lists.find((list) => list.id === selectedList)
  }

  const backToListView = () => {
    setViewingListArticles(false)
    setSelectedArticle(null)
  }

  // Handle updating an article (e.g., when tags are added/removed)
  const handleUpdateArticle = (updatedArticle: Article) => {
    if (viewingListArticles) {
      // Update in list articles
      setListArticles((prev) => prev.map((article) => (article.id === updatedArticle.id ? updatedArticle : article)))
    } else {
      // Update in regular articles
      setArticles((prev) => prev.map((article) => (article.id === updatedArticle.id ? updatedArticle : article)))
    }

    // Update selected article if it's the one being modified
    if (selectedArticle && selectedArticle.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle)
    }
  }

  const handleUpdate = async () => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      if (viewingListArticles) {
        // Update all articles in the current list
        await fetchListArticles(selectedList)
        // Show success toast
        toast({
          title: "Updated Successfully",
          description: `${getCurrentList()?.name || "List"} articles have been refreshed.`,
        })
      } else if (selectedFeed) {
        // Update a single feed's articles
        await fetchArticles(selectedFeed.url)
        // Show success toast
        toast({
          title: "Updated Successfully",
          description: `${selectedFeed.title} articles have been refreshed.`,
        })
      }
    } catch (error) {
      console.error("Error updating articles:", error)
      // Show error toast
      toast({
        title: "Update Failed",
        description: "There was a problem updating the articles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Update the markArticleAsRead function to persist read status
  const markArticleAsRead = (articleId: string) => {
    // Add to the set of read article IDs
    setReadArticleIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(articleId)
      return newSet
    })

    // Update in the main articles array
    setArticles((prev) => prev.map((article) => (article.id === articleId ? { ...article, isRead: true } : article)))

    // Update in the list articles array
    setListArticles((prev) =>
      prev.map((article) => (article.id === articleId ? { ...article, isRead: true } : article)),
    )

    // Update the selected article if it's the one being marked as read
    if (selectedArticle && selectedArticle.id === articleId) {
      setSelectedArticle({ ...selectedArticle, isRead: true })
    }
  }

  // Add a function to mark all articles as read
  const markAllAsRead = () => {
    // Get all article IDs from the current view
    const articleIds = viewingListArticles
      ? listArticles.map((article) => article.id)
      : articles.map((article) => article.id)

    // Add all to the set of read article IDs
    setReadArticleIds((prev) => {
      const newSet = new Set(prev)
      articleIds.forEach((id) => newSet.add(id))
      return newSet
    })

    // Update all articles in the current view
    if (viewingListArticles) {
      setListArticles((prev) => prev.map((article) => ({ ...article, isRead: true })))
    } else {
      setArticles((prev) => prev.map((article) => ({ ...article, isRead: true })))
    }

    // Update selected article if there is one
    if (selectedArticle) {
      setSelectedArticle({ ...selectedArticle, isRead: true })
    }

    // Show success toast
    toast({
      title: "Marked as Read",
      description: "All articles have been marked as read",
    })
  }

  // Add a function to check if an article is read
  const isArticleRead = (articleId: string) => {
    return readArticleIds.has(articleId)
  }

  // Include the new functions in the return object
  return {
    // State
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

    // Setters
    setSearchQuery,
    setSelectedArticle,
    setActiveTab,
    setSidebarCollapsed,
    setEditingListName,

    // Actions
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
    markAllAsRead,
    isArticleRead,
  }
}
