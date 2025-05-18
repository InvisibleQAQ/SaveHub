"use client"

import { useState, useEffect } from "react"
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "./utils/local-storage"

export function useUIState() {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("feeds")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // 从本地存储加载暗黑模式设置
  useEffect(() => {
    const savedDarkMode = loadFromStorage<boolean>(STORAGE_KEYS.DARK_MODE, true)
    if (savedDarkMode !== undefined) {
      setDarkMode(savedDarkMode)
      if (savedDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [])

  // 保存暗黑模式设置到本地存储
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DARK_MODE, darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return {
    // 状态
    darkMode,
    activeTab,
    sidebarCollapsed,
    searchQuery,
    isLoading,
    isUpdating,
    
    // 设置器
    setActiveTab,
    setSidebarCollapsed,
    setSearchQuery,
    setIsLoading,
    setIsUpdating,
    
    // 动作
    toggleDarkMode
  }
} 