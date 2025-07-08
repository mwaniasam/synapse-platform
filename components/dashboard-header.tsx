"use client"

import { Brain, Settings, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  onRefresh?: () => void
  onExport?: () => void
  onSettings?: () => void
}

export function DashboardHeader({ onRefresh, onExport, onSettings }: DashboardHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Synapse Dashboard</h1>
                <p className="text-blue-100">Cognitive Learning Analytics</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              v2.0.0
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onRefresh} className="text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={onExport} className="text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onSettings} className="text-white hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
