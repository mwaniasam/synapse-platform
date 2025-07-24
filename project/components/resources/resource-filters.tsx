"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"

interface ResourceFiltersProps {
  filters: {
    search: string
    subject: string
    difficulty: string
    format: string
  }
  onFiltersChange: (filters: any) => void
  subjects?: string[]
  difficulties?: string[]
  formats?: string[]
}

export function ResourceFilters({ 
  filters, 
  onFiltersChange, 
  subjects = [], 
  difficulties = [], 
  formats = [] 
}: ResourceFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    // Convert "all" back to empty string for filtering logic
    const filterValue = value === "all" ? "" : value
    onFiltersChange({
      ...filters,
      [key]: filterValue
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      subject: "",
      difficulty: "",
      format: ""
    })
  }

  const getActiveFilters = () => {
    const activeFilters = []
    if (filters.search) activeFilters.push({ key: 'search', value: filters.search, label: `Search: ${filters.search}` })
    if (filters.subject) activeFilters.push({ key: 'subject', value: filters.subject, label: `Subject: ${filters.subject}` })
    if (filters.difficulty) activeFilters.push({ key: 'difficulty', value: filters.difficulty, label: `Difficulty: ${filters.difficulty}` })
    if (filters.format) activeFilters.push({ key: 'format', value: filters.format, label: `Format: ${filters.format}` })
    return activeFilters
  }

  const activeFilters = getActiveFilters()
  
  // Convert empty string values to "all" for the Select components
  const selectValues = {
    subject: filters.subject || "all",
    difficulty: filters.difficulty || "all", 
    format: filters.format || "all"
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Subject</Label>
          <Select value={selectValues.subject} onValueChange={(value) => updateFilter('subject', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects && subjects.length > 0 && subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={selectValues.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {difficulties && difficulties.length > 0 && difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <Select value={selectValues.format} onValueChange={(value) => updateFilter('format', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formats</SelectItem>
              {formats && formats.length > 0 && formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter(filter.key, "")}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
