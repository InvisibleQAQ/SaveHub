"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import {
  Home,
  Bookmark,
  Users,
  Zap,
  Search,
  PlusCircle,
  ChevronRight,
  ChevronsLeft,
  Rss,
  Newspaper,
} from "lucide-react"
import SidebarProfileDropdown from "./sidebar-profile-dropdown"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  setAddFeedOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  feedsCount: number
  handleFeedsTabMouseEnter: () => void
  handleFeedsTabMouseLeave: () => void
  feedsButtonRef: React.RefObject<HTMLButtonElement>
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  setAddFeedOpen,
  setSettingsOpen,
  feedsCount,
  handleFeedsTabMouseEnter,
  handleFeedsTabMouseLeave,
  feedsButtonRef,
}: SidebarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Close profile dropdown when sidebar is collapsed
  useEffect(() => {
    if (sidebarCollapsed) {
      setProfileDropdownOpen(false)
    }
  }, [sidebarCollapsed])

  return (
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
        <SidebarButton
          icon={<Home className="h-5 w-5 min-w-5" />}
          label="Dashboard"
          active={activeTab === "dashboard"}
          collapsed={sidebarCollapsed}
          onClick={() => setActiveTab("dashboard")}
        />

        <SidebarButton
          ref={feedsButtonRef}
          icon={<Newspaper className="h-5 w-5 min-w-5" />}
          label="Feeds"
          active={activeTab === "feeds"}
          collapsed={sidebarCollapsed}
          onClick={() => {
            setActiveTab("feeds")
          }}
          onMouseEnter={handleFeedsTabMouseEnter}
          onMouseLeave={handleFeedsTabMouseLeave}
          count={feedsCount}
        />

        <SidebarButton
          icon={<Bookmark className="h-5 w-5 min-w-5" />}
          label="Saved"
          active={activeTab === "saved"}
          collapsed={sidebarCollapsed}
          onClick={() => setActiveTab("saved")}
        />

        <SidebarButton
          icon={<Users className="h-5 w-5 min-w-5" />}
          label="Teams"
          active={activeTab === "teams"}
          collapsed={sidebarCollapsed}
          onClick={() => setActiveTab("teams")}
        />

        <SidebarButton
          icon={<Zap className="h-5 w-5 min-w-5" />}
          label="Automate"
          active={activeTab === "automate"}
          collapsed={sidebarCollapsed}
          onClick={() => setActiveTab("automate")}
        />

        <SidebarButton
          icon={<Search className="h-5 w-5 min-w-5" />}
          label="Search"
          active={false}
          collapsed={sidebarCollapsed}
          onClick={() => {}}
        />

        <SidebarButton
          icon={<PlusCircle className="h-5 w-5 min-w-5" />}
          label="Add feed"
          active={false}
          collapsed={sidebarCollapsed}
          onClick={() => setAddFeedOpen(true)}
        />
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
          <SidebarProfileDropdown
            onSettingsClick={() => {
              setSettingsOpen(true)
              setProfileDropdownOpen(false)
            }}
          />
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
  )
}

interface SidebarButtonProps {
  icon: React.ReactNode
  label: string
  active: boolean
  collapsed: boolean
  onClick: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  count?: number
  ref?: React.RefObject<HTMLButtonElement>
}

const SidebarButton = React.forwardRef<HTMLButtonElement, SidebarButtonProps>(
  ({ icon, label, active, collapsed, onClick, onMouseEnter, onMouseLeave, count }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        className={`flex items-center justify-start px-4 py-2 w-full text-blue-100 hover:text-white hover:bg-blue-600 ${
          active ? "bg-blue-600 text-white" : ""
        }`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
        {!collapsed && count !== undefined && count > 0 && (
          <span className="ml-auto bg-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>
    )
  },
)
SidebarButton.displayName = "SidebarButton"
