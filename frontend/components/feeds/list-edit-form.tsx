"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { RefObject } from "react"

interface ListEditFormProps {
  editInputRef: RefObject<HTMLInputElement>
  editingListName: string
  setEditingListName: (name: string) => void
  saveEditingList: () => void
  cancelEditingList: () => void
}

export default function ListEditForm({
  editInputRef,
  editingListName,
  setEditingListName,
  saveEditingList,
  cancelEditingList,
}: ListEditFormProps) {
  return (
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
  )
}
