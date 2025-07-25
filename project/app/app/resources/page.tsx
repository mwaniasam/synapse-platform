"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Search, BookOpen, Brain, Sparkles, Star, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ResourceCard } from "@/components/resources/resource-card"
import { ResourceFilters } from "@/components/resources/resource-filters"
import { ResourceViewer } from "@/components/resources/resource-viewer"
import ResourceService, { Resource } from "@/lib/resource-service"

export default function ResourcesPage() {
  const { data: session, status } = useSession()
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [aiSubject, setAiSubject] = useState("Science")
  const [aiDifficulty, setAiDifficulty] = useState("intermediate")
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    subject: "",
    difficulty: "",
    format: ""
  })

  // Load some example trivia questions on component mount
  useEffect(() => {
    const loadInitialContent = async () => {
      setLoading(true)
      try {
        const resourceService = ResourceService.getInstance()
        const triviaResources = await resourceService.getTrivia('science', 'easy', 3)
        setResources(triviaResources)
      } catch (error) {
        console.error('Failed to load initial content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialContent()
  }, [])

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    redirect("/auth/signin")
  }

  const subjects = Array.from(new Set(resources.map(r => r.subject).filter(Boolean)))
  const difficulties = Array.from(new Set(resources.map(r => r.difficulty).filter(Boolean)))
  const formats = Array.from(new Set(resources.map(r => r.format).filter(Boolean)))

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         resource.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesSubject = !filters.subject || resource.subject === filters.subject
    const matchesDifficulty = !filters.difficulty || resource.difficulty === filters.difficulty
    const matchesFormat = !filters.format || resource.format === filters.format

    return matchesSearch && matchesSubject && matchesDifficulty && matchesFormat
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const resourceService = ResourceService.getInstance()
      const newResources = await resourceService.searchAllProviders(searchQuery)
      setResources(prevResources => {
        // Remove duplicates and add new resources
        const existingIds = new Set(prevResources.map(r => r.id))
        const uniqueNewResources = newResources.filter(r => !existingIds.has(r.id))
        return [...prevResources, ...uniqueNewResources]
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiQuery.trim()) return

    setLoading(true)
    try {
      const resourceService = ResourceService.getInstance()
      const aiResources = await resourceService.generateAIContent(aiQuery, aiSubject, aiDifficulty)
      setResources(prevResources => [...prevResources, ...aiResources])
    } catch (error) {
      console.error('AI generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = (id: string) => {
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource
      )
    )
  }

  const handleStart = (id: string) => {
    const resource = resources.find(r => r.id === id)
    if (resource) {
      if (resource.format === 'quiz' || resource.provider === 'ai-generated') {
        setSelectedResource(resource)
      } else if (resource.url && resource.url !== '#') {
        window.open(resource.url, '_blank')
      }
    }
  }

  const quickStats = {
    totalResources: resources.length,
    bookmarked: resources.filter(r => r.bookmarked).length,
    inProgress: resources.filter(r => r.progress && r.progress > 0 && r.progress < 100).length,
    completed: resources.filter(r => r.progress === 100).length
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8 px-4 sm:px-6">
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Learning Resources
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Discover curated educational content tailored to your learning journey
          </p>
        </div>
      </div>

      {/* Search and AI Generation */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* External API Search */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Search Learning Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search books, articles, cultural items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-sm sm:text-base"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading || !searchQuery.trim()}
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Search across Open Library, Europeana cultural heritage, and trivia databases
            </p>
          </CardContent>
        </Card>

        {/* AI Content Generation */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
              AI Content Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Input
              placeholder="Topic to learn about..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="text-sm sm:text-base"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Subject</Label>
                <select
                  value={aiSubject}
                  onChange={(e) => setAiSubject(e.target.value)}
                  className="w-full p-2 text-xs sm:text-sm border rounded-md"
                >
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Literature">Literature</option>
                  <option value="Art">Art</option>
                  <option value="Technology">Technology</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Level</Label>
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleAIGenerate}
              disabled={loading || !aiQuery.trim()}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate AI Content"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{quickStats.totalResources}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.bookmarked}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResourceFilters
            filters={filters}
            onFiltersChange={setFilters}
            subjects={subjects}
            difficulties={difficulties}
            formats={formats}
          />
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
        </h2>

        {filters.search && (
          <Badge variant="outline">
            Searching for: &quot;{filters.search}&quot;
          </Badge>
        )}
      </div>

      {/* Resource Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-48 sm:h-64 animate-pulse">
                <CardHeader>
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-2 sm:h-3 bg-muted rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {!loading && filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onBookmark={handleBookmark}
            onStart={handleStart}
          />
        ))}
      </div>

      {!loading && filteredResources.length === 0 && resources.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-4">
              Search for learning resources or generate AI content to get started
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && filteredResources.length === 0 && resources.length > 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources match your filters</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => setFilters({ search: "", subject: "", difficulty: "", format: "" })}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resource Viewer Modal */}
      {selectedResource && (
        <ResourceViewer
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}
