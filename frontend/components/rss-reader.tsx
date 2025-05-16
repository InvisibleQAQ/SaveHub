"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
import {
  PlusCircle,
  Search,
  Settings,
  Home,
  Bookmark,
  Users,
  Zap,
  ChevronRight,
  ChevronsLeft,
  Newspaper,
  Rss,
  ListPlus,
  LogOut,
  Upload,
  List,
  Edit,
  Trash2,
  X,
  Check,
  ChevronDown,
  MoreHorizontal,
  Globe,
  ArrowLeft,
  ListChecks,
  ListOrdered,
  ListTodo,
  LayoutList,
  RefreshCw,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import FeedItem from "@/components/feed-item"
import ArticleView from "@/components/article-view"
import FeedImportModal from "@/components/feed-import-modal"
import ListManageModal from "@/components/list-manage-modal"
import ListArticleItem from "@/components/list-article-item"
import type { Feed, Article, FeedList, FolderIcon, ArticleTag } from "@/lib/types"

export default function RSSReader() {
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
  const [addFeedOpen, setAddFeedOpen] = useState(false)
  const [importFeedOpen, setImportFeedOpen] = useState(false)
  const [listManageOpen, setListManageOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [newFeedName, setNewFeedName] = useState("")
  const [newFeedList, setNewFeedList] = useState("newsfeed")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("feeds")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListName, setEditingListName] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)
  const [feedFavicons, setFeedFavicons] = useState<Record<string, string>>({})
  const [isFetchingListArticles, setIsFetchingListArticles] = useState(false)
  const [tags, setTags] = useState<ArticleTag[]>([])
  const [isMiddleColumnVisible, setIsMiddleColumnVisible] = useState(false)
  const [isHoveringFeedsTab, setIsHoveringFeedsTab] = useState(false)
  const middleColumnRef = useRef<HTMLDivElement>(null)
  const feedsButtonRef = useRef<HTMLButtonElement>(null)
  const [isUpdating, setIsUpdating] = useState(false)

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

  // Fetch articles when a feed is selected
  useEffect(() => {
    if (selectedFeed) {
      fetchArticles(selectedFeed.url)
      setViewingListArticles(false)
    }
  }, [selectedFeed])

  // Close profile dropdown when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setProfileDropdownOpen(false)
    }
  }, [sidebarCollapsed])

  // Focus input when editing list name
  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingListId])

  const addFeed = async () => {
    if (!newFeedUrl) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(newFeedUrl)}`)
      if (!response.ok) throw new Error("Failed to fetch feed")

      const data = await response.json()
      if (!data) throw new Error("Invalid feed data")

      const newFeed: Feed = {
        id: `feed-${Date.now()}`,
        title: newFeedName || data.title || "Untitled Feed",
        url: newFeedUrl,
        count: data.items?.length || 0,
        lastUpdated: new Date().toISOString(),
        listId: newFeedList,
        siteUrl: data.link || extractDomainFromUrl(newFeedUrl),
      }

      setFeeds((prev) => [...prev, newFeed])

      // Update list counts
      setLists((prev) => {
        return prev.map((list) => {
          if (list.id === newFeedList) {
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

      setNewFeedUrl("")
      setNewFeedName("")
      setAddFeedOpen(false)
      setSelectedFeed(newFeed)
      setSelectedList(newFeedList)
    } catch (error) {
      console.error("Error adding feed:", error)
      alert("Could not add feed. Please check the URL and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update the fetchArticles function to include sample tags
  const fetchArticles = async (url: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`)
      if (!response.ok) throw new Error("Failed to fetch articles")

      const data = await response.json()
      if (data && data.items) {
        const parsedArticles = data.items.map((item: any, index: number) => {
          // Generate some sample tags for demonstration
          const sampleTags =
            index % 3 === 0
              ? [
                  {
                    id: `tag-${Date.now()}-1`,
                    tag_name: "Technology",
                    tag_color: "#3b82f6",
                    article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                    attachedAt: new Date().toISOString(),
                  },
                  {
                    id: `tag-${Date.now()}-2`,
                    tag_name: "News",
                    tag_color: "#10b981",
                    article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                    attachedAt: new Date().toISOString(),
                  },
                ]
              : index % 3 === 1
                ? [
                    {
                      id: `tag-${Date.now()}-3`,
                      tag_name: "Important",
                      tag_color: "#ef4444",
                      article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                      attachedAt: new Date().toISOString(),
                    },
                  ]
                : []

          return {
            id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
            title: item.title || "Untitled",
            content: item.content || item.description || "",
            link: item.link || "",
            publishDate: item.pubDate || item.published || new Date().toISOString(),
            image: item.enclosure?.url || "",
            author: item.author || "Unknown",
            feedTitle: data.title || selectedFeed?.title || "Unknown Feed",
            feedId: selectedFeed?.id || "",
            tags: sampleTags,
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

  // Update the fetchListArticles function to include sample tags
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
              // Generate some sample tags for demonstration
              const sampleTags =
                index % 3 === 0
                  ? [
                      {
                        id: `tag-${Date.now()}-1`,
                        tag_name: "Technology",
                        tag_color: "#3b82f6",
                        article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                        attachedAt: new Date().toISOString(),
                      },
                      {
                        id: `tag-${Date.now()}-2`,
                        tag_name: "News",
                        tag_color: "#10b981",
                        article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                        attachedAt: new Date().toISOString(),
                      },
                    ]
                  : index % 3 === 1
                    ? [
                        {
                          id: `tag-${Date.now()}-3`,
                          tag_name: "Important",
                          tag_color: "#ef4444",
                          article_id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                          attachedAt: new Date().toISOString(),
                        },
                      ]
                    : []

              return {
                id: item.guid || item.id || `article-${Date.now()}-${Math.random()}`,
                title: item.title || "Untitled",
                content: item.content || item.description || "",
                link: item.link || "",
                publishDate: item.pubDate || item.published || new Date().toISOString(),
                image: item.enclosure?.url || "",
                author: item.author || "Unknown",
                feedTitle: data.title || feed.title || "Unknown Feed",
                feedId: feed.id,
                tags: sampleTags,
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

    setImportFeedOpen(false)
  }

  const getListColorClass = (color: string) => {
    if (!color) return "text-blue-600 dark:text-blue-500"

    const colorMap: Record<string, string> = {
      red: "text-red-600 dark:text-red-500",
      orange: "text-orange-600 dark:text-orange-500",
      amber: "text-amber-600 dark:text-amber-500",
      yellow: "text-yellow-600 dark:text-yellow-500",
      lime: "text-lime-600 dark:text-lime-500",
      green: "text-green-600 dark:text-green-500",
      emerald: "text-emerald-600 dark:text-emerald-500",
      teal: "text-teal-600 dark:text-teal-500",
      cyan: "text-cyan-600 dark:text-cyan-500",
      sky: "text-sky-600 dark:text-sky-500",
      blue: "text-blue-600 dark:text-blue-500",
      indigo: "text-indigo-600 dark:text-indigo-500",
      violet: "text-violet-600 dark:text-violet-500",
      purple: "text-purple-600 dark:text-purple-500",
      fuchsia: "text-fuchsia-600 dark:text-fuchsia-500",
      pink: "text-pink-600 dark:text-pink-500",
      rose: "text-rose-600 dark:text-rose-500",
    }

    return colorMap[color] || "text-blue-600 dark:text-blue-500"
  }

  const getIconComponent = (iconName: FolderIcon = "list") => {
    const iconMap: Record<string, React.ElementType> = {
      list: List,
      "list-checks": ListChecks,
      "list-ordered": ListOrdered,
      "list-todo": ListTodo,
      "layout-list": LayoutList,
      newspaper: Newspaper,
      bookmark: Bookmark,
      rss: Rss,
      globe: Globe,
      // Add more icon mappings as needed
    }

    return iconMap[iconName] || List
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
    if (activeTab === "feeds") {
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
  }, [activeTab])

  const handleUpdate = async () => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      if (viewingListArticles) {
        // Update all articles in the current list
        await fetchListArticles(selectedList)
        // Show success toast using the UI's toast system
        document.dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              title: "Updated Successfully",
              description: `${getCurrentList()?.name || "List"} articles have been refreshed.`,
              variant: "default",
            },
          }),
        )
      } else if (selectedFeed) {
        // Update a single feed's articles
        await fetchArticles(selectedFeed.url)
        // Show success toast
        document.dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              title: "Updated Successfully",
              description: `${selectedFeed.title} articles have been refreshed.`,
              variant: "default",
            },
          }),
        )
      }
    } catch (error) {
      console.error("Error updating articles:", error)
      // Show error toast
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Update Failed",
            description: "There was a problem updating the articles. Please try again.",
            variant: "destructive",
          },
        }),
      )
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Main Sidebar */}
      <div
        className={`flex flex-col ${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-blue-700 text-white transition-all duration-200`}
      >
        <div className="p-4 flex justify-center">
          <Avatar className="h-10 w-10 bg-blue-600 rounded-full">
            <Rss className="h-5 w-5 text-white" />
          </Avatar>
        </div>

        <div className="flex-1 flex flex-col py-4 space-y-6">
          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
              activeTab === "dashboard" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
          </Button>

          <Button
            ref={feedsButtonRef}
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
              activeTab === "feeds" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => {
              setActiveTab("feeds")
              setIsMiddleColumnVisible(true)
            }}
            onMouseEnter={handleFeedsTabMouseEnter}
            onMouseLeave={handleFeedsTabMouseLeave}
          >
            <Newspaper className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Feeds</span>}
            {!sidebarCollapsed && feeds.length > 0 && (
              <span className="ml-auto bg-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {feeds.reduce((acc, feed) => acc + feed.count, 0)}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
              activeTab === "saved" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Saved</span>}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
              activeTab === "teams" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("teams")}
          >
            <Users className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Teams</span>}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
              activeTab === "automate" ? "bg-blue-600 text-white" : ""
            }`}
            onClick={() => setActiveTab("automate")}
          >
            <Zap className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Automate</span>}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600`}
            onClick={() => setSearchQuery("")}
          >
            <Search className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Search</span>}
          </Button>

          <Button
            variant="ghost"
            className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600`}
            onClick={() => setAddFeedOpen(true)}
          >
            <PlusCircle className="h-5 w-5 min-w-5" />
            {!sidebarCollapsed && <span className="ml-3">Add feed</span>}
          </Button>
        </div>

        <div className="mt-auto p-4">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "px-2 py-2 hover:bg-blue-600 rounded-md cursor-pointer"
            }`}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <Avatar className="h-8 w-8 bg-blue-600 rounded-full">
              <img src="/diverse-user-avatars.png" alt="User Avatar" className="h-8 w-8 rounded-full" />
            </Avatar>

            {!sidebarCollapsed && (
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Alex Johnson</p>
              </div>
            )}

            {!sidebarCollapsed && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:text-white hover:bg-blue-600">
                <ChevronRight className={`h-4 w-4 transition-transform ${profileDropdownOpen ? "rotate-90" : ""}`} />
              </Button>
            )}
          </div>

          {/* Profile Dropdown */}
          {profileDropdownOpen && !sidebarCollapsed && (
            <div className="mt-2 py-1 bg-blue-800 rounded-md shadow-lg">
              <button
                className="w-full px-4 py-2 text-sm text-left text-blue-100 hover:bg-blue-700 flex items-center"
                onClick={() => {
                  setSettingsOpen(true)
                  setProfileDropdownOpen(false)
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-blue-100 hover:bg-blue-700 flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}

          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            className="w-full mt-4 flex items-center justify-center text-blue-100 hover:text-white hover:bg-blue-600"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "feeds" ? (
        <div className="flex flex-1">
          {/* Feed Categories */}
          <div
            ref={middleColumnRef}
            className={`${
              isMiddleColumnVisible ? "w-64" : "w-0"
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
                    <div className="flex items-center">
                      {editingListId === list.id ? (
                        <div className="flex items-center w-full bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                          <Input
                            ref={editInputRef}
                            value={editingListName}
                            onChange={(e) => setEditingListName(e.target.value)}
                            className="h-7 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditingList()
                              if (e.key === "Escape") cancelEditingList()
                            }}
                          />
                          <Button variant="ghost" size="icon" className="h-7 w-7 ml-1" onClick={saveEditingList}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={cancelEditingList}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant={selectedList === list.id ? "secondary" : "ghost"}
                          className="w-full justify-start px-2 py-1.5 h-auto"
                          onClick={() => {
                            if (selectedList === list.id && !viewingListArticles) {
                              // If clicking the same list and not already viewing its articles, show list articles
                              selectList(list.id)
                            } else if (selectedList !== list.id) {
                              // If clicking a different list, select it and toggle expansion
                              setSelectedList(list.id)
                              toggleListExpanded(list.id)
                            } else {
                              // If already viewing list articles, just toggle expansion
                              toggleListExpanded(list.id)
                            }
                          }}
                        >
                          <div className="flex items-center w-full">
                            <ChevronDown
                              className={`h-3.5 w-3.5 mr-1.5 transition-transform ${list.expanded ? "rotate-0" : "-rotate-90"}`}
                            />
                            <div className="flex items-center mr-2">
                              {React.createElement(
                                getIconComponent(list.icon || (list.id === "newsfeed" ? "newspaper" : "list")),
                                { className: `h-4 w-4 ${getListColorClass(list.color || "")}` },
                              )}
                            </div>
                            <span className="truncate text-left flex-1">{list.name}</span>
                            <span className="ml-auto text-xs text-slate-500">{list.count}</span>

                            {list.id !== "newsfeed" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => selectList(list.id)}>
                                    <Newspaper className="h-4 w-4 mr-2" />
                                    View All Articles
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => startEditingList(list.id, list.name)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Rename List
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setListManageOpen(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Customize Appearance
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onClick={() => deleteList(list.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete List
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </Button>
                      )}
                    </div>

                    {/* List Content */}
                    {list.expanded && (
                      <div className="pl-6 mt-1 space-y-1">
                        {list.feeds && list.feeds.length > 0 ? (
                          list.feeds.map((feed) => (
                            <Button
                              key={feed.id}
                              variant={selectedFeed?.id === feed.id ? "secondary" : "ghost"}
                              className="w-full justify-start px-2 py-1.5 h-auto text-sm"
                              onClick={() => selectFeed(feed)}
                            >
                              <div className="flex items-center w-full">
                                {feedFavicons[feed.id] ? (
                                  <img
                                    src={feedFavicons[feed.id] || "/placeholder.svg"}
                                    alt=""
                                    className="h-4 w-4 mr-2 rounded-sm"
                                    onError={(e) => {
                                      // If favicon fails to load, show default icon
                                      e.currentTarget.style.display = "none"
                                      const iconContainer = e.currentTarget.parentElement
                                      if (iconContainer) {
                                        const icon = document.createElement("span")
                                        icon.className = "h-4 w-4 mr-2 flex items-center justify-center"
                                        icon.innerHTML =
                                          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="h-3.5 w-3.5 text-slate-400"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                                        iconContainer.insertBefore(icon, e.currentTarget)
                                      }
                                    }}
                                  />
                                ) : (
                                  <Globe className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                )}
                                <span className="truncate text-left flex-1">{feed.title}</span>
                                {feed.count > 0 && <span className="ml-auto text-xs text-slate-500">{feed.count}</span>}
                              </div>
                            </Button>
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

          {/* Feed Items */}
          <div className="w-96 border-r border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {/* Search */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              {/* Feed or List Title */}
              <div className="flex items-center justify-between mb-3">
                {viewingListArticles ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-sm font-medium"
                      onClick={backToListView}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Lists
                    </Button>
                    <h2 className="font-semibold text-lg truncate flex-1 text-center">
                      {getCurrentList()?.name || "List"}
                    </h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-sm"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                          >
                            <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update articles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                ) : selectedFeed ? (
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold text-lg truncate flex-1">{selectedFeed.title}</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-sm"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                          >
                            <RefreshCw className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Update articles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <h2 className="font-semibold text-lg truncate w-full">All Articles</h2>
                )}
              </div>

              <div className="flex items-center space-x-1 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 h-6 px-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Articles List */}
            <ScrollArea className="h-[calc(100vh-60px)]">
              {isLoading || isFetchingListArticles ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
                </div>
              ) : viewingListArticles ? (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {listArticles.length > 0 ? (
                    listArticles
                      .filter((article) =>
                        searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
                      )
                      .map((article) => (
                        <ListArticleItem
                          key={article.id}
                          article={article}
                          isSelected={selectedArticle?.id === article.id}
                          onClick={() => setSelectedArticle(article)}
                          favicon={feedFavicons[article.feedId] || ""}
                        />
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                      <Newspaper className="h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No articles found</h3>
                      <p className="text-sm text-slate-500 max-w-xs">
                        This list doesn't have any articles yet. Try adding some feeds to this list.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {articles
                    .filter((article) =>
                      searchQuery ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
                    )
                    .map((article) => (
                      <FeedItem
                        key={article.id}
                        article={article}
                        isSelected={selectedArticle?.id === article.id}
                        onClick={() => setSelectedArticle(article)}
                      />
                    ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-hidden">
            {selectedArticle ? (
              <ArticleView article={selectedArticle} onUpdateArticle={handleUpdateArticle} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Select an article to view</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Placeholder content for other tabs
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900">
          <div className="text-center max-w-md p-6">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "dashboard" && <Home className="h-8 w-8 text-slate-400" />}
              {activeTab === "saved" && <Bookmark className="h-8 w-8 text-slate-400" />}
              {activeTab === "teams" && <Users className="h-8 w-8 text-slate-400" />}
              {activeTab === "automate" && <Zap className="h-8 w-8 text-slate-400" />}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "saved" && "Saved Articles"}
              {activeTab === "teams" && "Teams"}
              {activeTab === "automate" && "Automation"}
            </h2>
            <p className="text-slate-500 mb-4">
              {activeTab === "dashboard" && "View your personalized dashboard with stats and recommendations."}
              {activeTab === "saved" && "Access your bookmarked and saved articles for later reading."}
              {activeTab === "teams" && "Collaborate with your team members and share interesting content."}
              {activeTab === "automate" && "Set up automation rules to organize your feeds and articles."}
            </p>
            <Button variant="outline" onClick={() => setActiveTab("feeds")}>
              Go to Feeds
            </Button>
          </div>
        </div>
      )}

      {/* Add Feed Dialog */}
      <Dialog open={addFeedOpen} onOpenChange={setAddFeedOpen}>
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
            <Button variant="outline" onClick={() => setAddFeedOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addFeed} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Feed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="appearance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="feeds">Feeds</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dark Mode</label>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Compact View</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Images</label>
                <Switch defaultChecked />
              </div>
            </TabsContent>
            <TabsContent value="feeds" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Refresh</label>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Refresh Interval</label>
                <select className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                  <option value="120">Every 2 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mark as read when scrolled</label>
                <Switch defaultChecked />
              </div>
            </TabsContent>
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input defaultValue="user@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sync across devices</label>
                <Switch />
              </div>
              <Button variant="outline" className="w-full">
                Sign Out
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Feed Import Modal */}
      <FeedImportModal
        open={importFeedOpen}
        onOpenChange={setImportFeedOpen}
        lists={lists}
        onImport={handleImportFeeds}
      />

      {/* List Management Modal */}
      <ListManageModal
        open={listManageOpen}
        onOpenChange={setListManageOpen}
        lists={lists.filter((f) => f.id !== "newsfeed")}
        onAddList={addList}
        onRenameList={(id, name) => {
          setLists((prev) => prev.map((list) => (list.id === id ? { ...list, name } : list)))
        }}
        onDeleteList={deleteList}
        onUpdateListAppearance={updateListAppearance}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
