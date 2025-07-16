"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Filter, ZoomIn, ZoomOut, Download, Share } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navigation from "@/components/navigation"

export default function KnowledgeMap() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("synapse_auth")
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Knowledge Map</h1>
          <p className="text-gray-600">Visualize and explore your learning connections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search concepts..." className="pl-10" />
                </div>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Map Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ZoomIn className="w-4 h-4 mr-1" />
                    Zoom In
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ZoomOut className="w-4 h-4 mr-1" />
                    Zoom Out
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Reset View
                </Button>

                <Separator />

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Concept
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-full">
              <CardContent className="p-0 h-full">
                <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for knowledge graph visualization */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">Interactive Knowledge Graph</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        Your knowledge graph will appear here. Connect concepts, explore relationships, and discover new
                        learning paths.
                      </p>
                    </div>
                  </div>

                  {/* Sample nodes for demonstration */}
                  <div className="absolute top-20 left-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-32 right-32 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-24 left-32 w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-700"></div>
                  <div className="absolute bottom-32 right-24 w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-1000"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg">Concept Details</CardTitle>
                <CardDescription>Select a concept to view details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Machine Learning</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    A subset of artificial intelligence that enables computers to learn and improve from experience.
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      AI
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Data Science
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Algorithms
                    </Badge>
                  </div>
                  <div className="text-xs text-blue-600">
                    <div>Connections: 12</div>
                    <div>Last updated: 2 hours ago</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Related Concepts</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Neural Networks</span>
                      <Badge variant="outline" className="text-xs">
                        Strong
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Deep Learning</span>
                      <Badge variant="outline" className="text-xs">
                        Strong
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Statistics</span>
                      <Badge variant="outline" className="text-xs">
                        Medium
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Learning Resources</h5>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium">Introduction to ML</div>
                      <div className="text-xs text-gray-500">Coursera • 4 weeks ago</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium">ML Algorithms Guide</div>
                      <div className="text-xs text-gray-500">Medium • 1 week ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
