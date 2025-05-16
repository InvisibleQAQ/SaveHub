"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Folder,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Newspaper,
  Bookmark,
  Rss,
  Globe,
  FileText,
  Music,
  Video,
  ImageIcon,
  Package,
  Star,
  Heart,
  Coffee,
  Zap,
  Book,
  Briefcase,
  Camera,
  Code,
  Database,
  Film,
  Headphones,
  Mail,
  Monitor,
  ShoppingCart,
  Smartphone,
  Truck,
  Tv,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FeedFolder, FolderIcon } from "@/lib/types"

interface FolderManageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folders: FeedFolder[]
  onAddFolder: (name: string, color?: string, icon?: FolderIcon) => void
  onRenameFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  onUpdateFolderAppearance: (id: string, color?: string, icon?: FolderIcon) => void
}

// Available folder colors
const folderColors = [
  { name: "Default", value: "" },
  { name: "Red", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Amber", value: "amber" },
  { name: "Yellow", value: "yellow" },
  { name: "Lime", value: "lime" },
  { name: "Green", value: "green" },
  { name: "Emerald", value: "emerald" },
  { name: "Teal", value: "teal" },
  { name: "Cyan", value: "cyan" },
  { name: "Sky", value: "sky" },
  { name: "Blue", value: "blue" },
  { name: "Indigo", value: "indigo" },
  { name: "Violet", value: "violet" },
  { name: "Purple", value: "purple" },
  { name: "Fuchsia", value: "fuchsia" },
  { name: "Pink", value: "pink" },
  { name: "Rose", value: "rose" },
]

// Available folder icons
const folderIcons: { name: string; icon: FolderIcon; component: React.ElementType }[] = [
  { name: "Folder", icon: "folder", component: Folder },
  { name: "Newspaper", icon: "newspaper", component: Newspaper },
  { name: "Bookmark", icon: "bookmark", component: Bookmark },
  { name: "RSS", icon: "rss", component: Rss },
  { name: "Globe", icon: "globe", component: Globe },
  { name: "File", icon: "file", component: FileText },
  { name: "Music", icon: "music", component: Music },
  { name: "Video", icon: "video", component: Video },
  { name: "Image", icon: "image", component: ImageIcon },
  { name: "Package", icon: "package", component: Package },
  { name: "Star", icon: "star", component: Star },
  { name: "Heart", icon: "heart", component: Heart },
  { name: "Coffee", icon: "coffee", component: Coffee },
  { name: "Zap", icon: "zap", component: Zap },
  { name: "Book", icon: "book", component: Book },
  { name: "Briefcase", icon: "briefcase", component: Briefcase },
  { name: "Camera", icon: "camera", component: Camera },
  { name: "Code", icon: "code", component: Code },
  { name: "Database", icon: "database", component: Database },
  { name: "Film", icon: "film", component: Film },
  { name: "Headphones", icon: "headphones", component: Headphones },
  { name: "Mail", icon: "mail", component: Mail },
  { name: "Monitor", icon: "monitor", component: Monitor },
  { name: "ShoppingCart", icon: "shopping-cart", component: ShoppingCart },
  { name: "Smartphone", icon: "smartphone", component: Smartphone },
  { name: "Truck", icon: "truck", component: Truck },
  { name: "TV", icon: "tv", component: Tv },
]

export default function FolderManageModal({
  open,
  onOpenChange,
  folders,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onUpdateFolderAppearance,
}: FolderManageModalProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("")
  const [newFolderIcon, setNewFolderIcon] = useState<FolderIcon>("folder")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingFolderId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingFolderId])

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor, newFolderIcon)
      setNewFolderName("")
      setNewFolderColor("")
      setNewFolderIcon("folder")
    }
  }

  const startEditingFolder = (folder: FeedFolder) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }

  const saveEditingFolder = () => {
    if (editingFolderId && editingFolderName.trim()) {
      onRenameFolder(editingFolderId, editingFolderName.trim())
      setEditingFolderId(null)
      setEditingFolderName("")
    }
  }

  const cancelEditingFolder = () => {
    setEditingFolderId(null)
    setEditingFolderName("")
  }

  const getIconComponent = (iconName: FolderIcon) => {
    const iconObj = folderIcons.find((i) => i.icon === iconName)
    return iconObj ? iconObj.component : Folder
  }

  const getFolderColorClass = (color: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Folders</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="new-folder">Add New Folder</Label>
            <div className="flex space-x-2">
              <Input
                id="new-folder"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddFolder()
                }}
              />
              <Button onClick={handleAddFolder} disabled={!newFolderName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex space-x-2 mt-2">
              <div className="flex-1">
                <Label htmlFor="folder-color" className="text-xs">
                  Color
                </Label>
                <select
                  id="folder-color"
                  className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                >
                  {folderColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <Label htmlFor="folder-icon" className="text-xs">
                  Icon
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between" id="folder-icon">
                      {React.createElement(getIconComponent(newFolderIcon), {
                        className: "h-4 w-4 mr-2",
                      })}
                      <span className="text-sm">
                        {folderIcons.find((i) => i.icon === newFolderIcon)?.name || "Folder"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <div className="p-2 grid grid-cols-5 gap-1">
                      {folderIcons.map((iconObj) => (
                        <Button
                          key={iconObj.icon}
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${newFolderIcon === iconObj.icon ? "bg-slate-200 dark:bg-slate-700" : ""}`}
                          onClick={() => setNewFolderIcon(iconObj.icon)}
                          title={iconObj.name}
                        >
                          {React.createElement(iconObj.component, { className: "h-4 w-4" })}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Folders</Label>
            <div className="border rounded-md divide-y">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <div key={folder.id} className="p-3 flex items-center justify-between">
                    {editingFolderId === folder.id ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          ref={editInputRef}
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEditingFolder()
                            if (e.key === "Escape") cancelEditingFolder()
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={saveEditingFolder}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={cancelEditingFolder}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          {React.createElement(getIconComponent(folder.icon || "folder"), {
                            className: `h-4 w-4 mr-2 ${getFolderColorClass(folder.color || "")}`,
                          })}
                          <span>{folder.name}</span>
                          <span className="ml-2 text-xs text-slate-500">({folder.count})</span>
                        </div>
                        <div className="flex space-x-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-0" align="end">
                              <Tabs defaultValue="appearance">
                                <TabsList className="w-full">
                                  <TabsTrigger value="appearance" className="flex-1">
                                    Appearance
                                  </TabsTrigger>
                                  <TabsTrigger value="rename" className="flex-1">
                                    Rename
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="appearance" className="p-3 space-y-3">
                                  <div>
                                    <Label className="text-xs">Color</Label>
                                    <div className="grid grid-cols-6 gap-1 mt-1">
                                      {folderColors.map((color) => (
                                        <Button
                                          key={color.value}
                                          variant="outline"
                                          size="icon"
                                          className={`h-8 w-8 ${color.value ? `bg-${color.value}-100 dark:bg-${color.value}-900/20` : ""} ${folder.color === color.value ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                                          onClick={() => onUpdateFolderAppearance(folder.id, color.value, folder.icon)}
                                          title={color.name}
                                        >
                                          <div
                                            className={`h-4 w-4 rounded-full ${color.value ? `bg-${color.value}-500` : "bg-blue-500"}`}
                                          />
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs">Icon</Label>
                                    <div className="grid grid-cols-6 gap-1 mt-1 max-h-32 overflow-y-auto">
                                      {folderIcons.map((iconObj) => (
                                        <Button
                                          key={iconObj.icon}
                                          variant="outline"
                                          size="icon"
                                          className={`h-8 w-8 ${folder.icon === iconObj.icon ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                                          onClick={() =>
                                            onUpdateFolderAppearance(folder.id, folder.color, iconObj.icon)
                                          }
                                          title={iconObj.name}
                                        >
                                          {React.createElement(iconObj.component, {
                                            className: `h-4 w-4 ${getFolderColorClass(folder.color || "")}`,
                                          })}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </TabsContent>
                                <TabsContent value="rename" className="p-3">
                                  <div className="space-y-2">
                                    <Label>Folder Name</Label>
                                    <div className="flex space-x-2">
                                      <Input
                                        defaultValue={folder.name}
                                        onChange={(e) => setEditingFolderName(e.target.value)}
                                        onFocus={(e) => setEditingFolderName(e.target.value)}
                                      />
                                      <Button
                                        onClick={() => {
                                          if (editingFolderName) {
                                            onRenameFolder(folder.id, editingFolderName)
                                          }
                                        }}
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => onDeleteFolder(folder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">No custom folders yet. Add one above.</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
