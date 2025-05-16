"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, MoreHorizontal, Newspaper, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { getIconComponent, getListColorClass } from "@/lib/ui-helpers"
import type { FeedList } from "@/lib/types"

interface ListHeaderProps {
  list: FeedList
  selectedList: string
  selectList: (listId: string) => void
  toggleListExpanded: (listId: string) => void
  startEditingList: (listId: string, currentName: string) => void
  deleteList: (listId: string) => void
  setListManageOpen: (open: boolean) => void
}

export default function ListHeader({
  list,
  selectedList,
  selectList,
  toggleListExpanded,
  startEditingList,
  deleteList,
  setListManageOpen,
}: ListHeaderProps) {
  return (
    <Button
      variant={selectedList === list.id ? "secondary" : "ghost"}
      className="w-full justify-start px-2 py-1.5 h-auto"
      onClick={() => {
        if (selectedList === list.id) {
          toggleListExpanded(list.id)
        } else {
          selectList(list.id)
          toggleListExpanded(list.id)
        }
      }}
    >
      <div className="flex items-center w-full">
        <ChevronDown
          className={`h-3.5 w-3.5 mr-1.5 transition-transform ${list.expanded ? "rotate-0" : "-rotate-90"}`}
        />
        <div className="flex items-center mr-2">
          {React.createElement(getIconComponent(list.icon || (list.id === "newsfeed" ? "newspaper" : "list")), {
            className: `h-4 w-4 ${getListColorClass(list.color || "")}`,
          })}
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
              <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => deleteList(list.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Button>
  )
}
