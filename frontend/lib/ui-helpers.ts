import type React from "react"
import { List, ListChecks, ListOrdered, ListTodo, LayoutList, Newspaper, Bookmark, Rss, Globe } from "lucide-react"
import type { FolderIcon } from "@/lib/types"

export function getListColorClass(color: string): string {
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

export function getIconComponent(iconName: FolderIcon = "list"): React.ElementType {
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
