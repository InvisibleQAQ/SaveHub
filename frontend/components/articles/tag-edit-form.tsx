"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import type { RefObject } from "react"

interface TagEditFormProps {
  editTagInputRef: RefObject<HTMLInputElement>
  editTagName: string
  setEditTagName: (name: string) => void
  editTagColor: string
  setEditTagColor: (color: string) => void
  saveEditedTag: () => void
  colorOptions: { name: string; value: string }[]
}

export default function TagEditForm({
  editTagInputRef,
  editTagName,
  setEditTagName,
  editTagColor,
  setEditTagColor,
  saveEditedTag,
  colorOptions,
}: TagEditFormProps) {
  return (
    <div className="flex items-center space-x-1 bg-background border rounded-md p-1">
      <Input
        ref={editTagInputRef}
        value={editTagName}
        onChange={(e) => setEditTagName(e.target.value)}
        className="h-6 text-xs min-w-[100px] max-w-[150px]"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editTagColor }}></div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <div
                key={color.value}
                className={`w-full aspect-square rounded-md cursor-pointer border-2 ${
                  editTagColor === color.value ? "border-primary" : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setEditTagColor(color.value)}
                title={color.name}
              ></div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={saveEditedTag}>
        <Check className="h-3 w-3" />
      </Button>
    </div>
  )
}
