// RSS Reader本地存储工具

/**
 * 从本地存储中加载数据
 */
export function loadFromStorage<T>(key: string, defaultValue?: T): T | undefined {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e)
  }
  
  return defaultValue
}

/**
 * 保存数据到本地存储
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e)
  }
}

// 本地存储的键名常量
export const STORAGE_KEYS = {
  FEEDS: 'rss-feeds',
  LISTS: 'rss-lists',
  FAVICONS: 'rss-favicons',
  TAGS: 'rss-tags',
  DARK_MODE: 'rss-dark-mode',
  READ_ARTICLES: 'rss-read-articles'
} 