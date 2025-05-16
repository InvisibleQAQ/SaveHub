"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

interface ArticleListHeaderProps {
  title: string
  showBackButton: boolean
  onBackClick?: () => void
  onUpdateClick: () => void
  isUpdating: boolean
}

export default function ArticleListHeader({
  title,
  showBackButton,
  onBackClick,
  onUpdateClick,
  isUpdating,
}: ArticleListHeaderProps) {
  return (
    <>
      {showBackButton ? (
        <>
          <Button variant="ghost" size="sm" className="flex items-center text-sm font-medium" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Lists
          </Button>
          <h2 className="font-semibold text-lg truncate flex-1 text-center">{title}</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                  onClick={onUpdateClick}
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
      ) : (
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold text-lg truncate flex-1">{title}</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-sm"
                  onClick={onUpdateClick}
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
      )}
    </>
  )
}
