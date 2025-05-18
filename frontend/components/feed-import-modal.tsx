"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Plus, FileText } from "lucide-react"
import type { Feed, FeedList } from "@/lib/types"

interface FeedImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lists: FeedList[]
  onImport: (feeds: Feed[]) => void
}

interface ImportedFeed {
  url: string
  title: string
  listId: string
}

export default function FeedImportModal({ open, onOpenChange, lists, onImport }: FeedImportModalProps) {
  const [importMethod, setImportMethod] = useState<"manual" | "opml">("manual")
  const [manualFeeds, setManualFeeds] = useState<ImportedFeed[]>([
    { url: "", title: "", listId: lists[0]?.id || "newsfeed" },
  ])
  const [opmlFile, setOpmlFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addManualFeed = () => {
    setManualFeeds([...manualFeeds, { url: "", title: "", listId: lists[0]?.id || "newsfeed" }])
  }

  const removeManualFeed = (index: number) => {
    setManualFeeds(manualFeeds.filter((_, i) => i !== index))
  }

  const updateManualFeed = (index: number, field: keyof ImportedFeed, value: string) => {
    const updatedFeeds = [...manualFeeds]
    updatedFeeds[index] = { ...updatedFeeds[index], [field]: value }
    setManualFeeds(updatedFeeds)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setOpmlFile(e.target.files[0])
    }
  }

  // Update the handleImport function to properly handle the async operation
  const handleImport = async () => {
    setIsLoading(true)

    try {
      if (importMethod === "manual") {
        // Filter out empty URLs
        const validFeeds = manualFeeds.filter((feed) => feed.url.trim() !== "")

        // Convert to Feed objects
        const feeds: Feed[] = validFeeds.map((feed) => ({
          id: `feed-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          url: feed.url,
          title: feed.title || feed.url,
          listId: feed.listId,
          count: 0,
          lastUpdated: new Date().toISOString(),
        }))

        await onImport(feeds)
      } else if (importMethod === "opml" && opmlFile) {
        // Read OPML file
        const text = await opmlFile.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        // Extract feeds from OPML
        const outlines = xmlDoc.querySelectorAll("outline[xmlUrl]")
        const feeds: Feed[] = Array.from(outlines).map((outline) => {
          const title = outline.getAttribute("title") || outline.getAttribute("text") || "Untitled Feed"
          const url = outline.getAttribute("xmlUrl") || ""

          // Try to find a matching list or use default
          let listId = lists[0]?.id || "newsfeed"
          const category = outline.getAttribute("category") || outline.parentElement?.getAttribute("title")

          if (category) {
            const matchingList = lists.find((f) => f.name.toLowerCase() === category.toLowerCase())
            if (matchingList) {
              listId = matchingList.id
            }
          }

          return {
            id: `feed-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            url,
            title,
            listId,
            count: 0,
            lastUpdated: new Date().toISOString(),
          }
        })

        await onImport(feeds)
      }

      // Close the modal after successful import
      onOpenChange(false)
    } catch (error) {
      console.error("Error importing feeds:", error)
      alert("Failed to import feeds. Please check your input and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import RSS Feeds</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex space-x-2">
            <Button
              variant={importMethod === "manual" ? "default" : "outline"}
              onClick={() => setImportMethod("manual")}
              className="flex-1"
            >
              Manual Entry
            </Button>
            <Button
              variant={importMethod === "opml" ? "default" : "outline"}
              onClick={() => setImportMethod("opml")}
              className="flex-1"
            >
              OPML File
            </Button>
          </div>

          {importMethod === "manual" ? (
            <div className="space-y-4">
              {manualFeeds.map((feed, index) => (
                <div key={index} className="space-y-2 p-3 border rounded-md relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeManualFeed(index)}
                    disabled={manualFeeds.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="space-y-1">
                    <Label htmlFor={`feed-url-${index}`}>Feed URL</Label>
                    <Input
                      id={`feed-url-${index}`}
                      value={feed.url}
                      onChange={(e) => updateManualFeed(index, "url", e.target.value)}
                      placeholder="https://example.com/feed.xml"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`feed-title-${index}`}>Custom Name (optional)</Label>
                    <Input
                      id={`feed-title-${index}`}
                      value={feed.title}
                      onChange={(e) => updateManualFeed(index, "title", e.target.value)}
                      placeholder="My Feed"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`feed-list-${index}`}>List</Label>
                    <select
                      id={`feed-list-${index}`}
                      className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      value={feed.listId}
                      onChange={(e) => updateManualFeed(index, "listId", e.target.value)}
                    >
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addManualFeed}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Feed
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                {opmlFile ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm font-medium">{opmlFile.name}</p>
                    <p className="text-xs text-slate-500">{(opmlFile.size / 1024).toFixed(1)} KB</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => setOpmlFile(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm font-medium">Drop your OPML file here, or click to browse</p>
                    <p className="text-xs text-slate-500 mt-1">Supports OPML files exported from other RSS readers</p>
                    <Input
                      type="file"
                      accept=".opml,.xml"
                      className="hidden"
                      id="opml-upload"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="opml-upload" className="mt-4">
                      <Button variant="outline" type="button" className="cursor-pointer">
                        Select File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Default List for Imported Feeds</Label>
                <select
                  className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  defaultValue={lists[0]?.id || "newsfeed"}
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">
                  Feeds will be placed in matching lists if found in the OPML file, or in this default list.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? "Importing..." : "Import Feeds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
