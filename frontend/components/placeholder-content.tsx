"use client"

import { Home, Bookmark, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlaceholderContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function PlaceholderContent({ activeTab, setActiveTab }: PlaceholderContentProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="text-center max-w-md p-6">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          {activeTab === "dashboard" && <Home className="h-8 w-8 text-slate-400" />}
          {activeTab === "saved" && <Bookmark className="h-8 w-8 text-slate-400" />}
          {activeTab === "teams" && <Users className="h-8 w-8 text-slate-400" />}
          {activeTab === "automate" && <Zap className="h-8 w-8 text-slate-400" />}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {activeTab === "dashboard" && "Dashboard"}
          {activeTab === "saved" && "Saved Articles"}
          {activeTab === "teams" && "Teams"}
          {activeTab === "automate" && "Automation"}
        </h2>
        <p className="text-slate-500 mb-4">
          {activeTab === "dashboard" && "View your personalized dashboard with stats and recommendations."}
          {activeTab === "saved" && "Access your bookmarked and saved articles for later reading."}
          {activeTab === "teams" && "Collaborate with your team members and share interesting content."}
          {activeTab === "automate" && "Set up automation rules to organize your feeds and articles."}
        </p>
        <Button variant="outline" onClick={() => setActiveTab("feeds")}>
          Go to Feeds
        </Button>
      </div>
    </div>
  )
}
