"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function SettingsDialog({ open, onOpenChange, darkMode, onToggleDarkMode }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="appearance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="feeds">Feeds</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Dark Mode</label>
              <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Compact View</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Images</label>
              <Switch defaultChecked />
            </div>
          </TabsContent>
          <TabsContent value="feeds" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto Refresh</label>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Refresh Interval</label>
              <select className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
                <option value="120">Every 2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mark as read when scrolled</label>
              <Switch defaultChecked />
            </div>
          </TabsContent>
          <TabsContent value="account" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input defaultValue="user@example.com" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sync across devices</label>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">
              Sign Out
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
