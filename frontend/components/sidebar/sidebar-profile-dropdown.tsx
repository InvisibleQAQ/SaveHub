"use client"

import { Settings, LogOut } from "lucide-react"

interface SidebarProfileDropdownProps {
  onSettingsClick: () => void
}

export default function SidebarProfileDropdown({ onSettingsClick }: SidebarProfileDropdownProps) {
  return (
    <div className="mt-2 py-1 bg-blue-800 rounded-md shadow-lg">
      <button
        className="w-full px-4 py-2 text-sm text-left text-blue-100 hover:bg-blue-700 flex items-center"
        onClick={onSettingsClick}
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </button>
      <button className="w-full px-4 py-2 text-sm text-left text-blue-100 hover:bg-blue-700 flex items-center">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </button>
    </div>
  )
}
