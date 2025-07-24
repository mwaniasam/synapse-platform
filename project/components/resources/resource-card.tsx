import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Bookmark, Play, ExternalLink, User } from "lucide-react"
import Link from "next/link"
import { Resource } from "@/lib/resource-service"

interface ResourceCardProps {
  resource: Resource
  onBookmark?: (id: string) => void
  onStart?: (id: string) => void
}

export function ResourceCard({ resource, onBookmark, onStart }: ResourceCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'book': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'video': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'article': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'quiz': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      case 'interactive': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'open-library': return { label: 'Open Library', color: 'bg-emerald-100 text-emerald-800' }
      case 'europeana': return { label: 'Europeana', color: 'bg-blue-100 text-blue-800' }
      case 'trivia': return { label: 'Trivia Quiz', color: 'bg-pink-100 text-pink-800' }
      case 'ai-generated': return { label: 'AI Generated', color: 'bg-violet-100 text-violet-800' }
      default: return { label: provider, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const providerInfo = getProviderBadge(resource.provider)

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">{resource.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{resource.subject}</Badge>
              <Badge className={getDifficultyColor(resource.difficulty)}>
                {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
              </Badge>
              <Badge className={getFormatColor(resource.format)}>
                {resource.format.charAt(0).toUpperCase() + resource.format.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={providerInfo.color}>
            {providerInfo.label}
          </Badge>
          {onBookmark && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBookmark(resource.id)}
              className={resource.bookmarked ? "text-yellow-500" : "text-muted-foreground"}
            >
              <Bookmark className={`h-4 w-4 ${resource.bookmarked ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {resource.description}
        </p>

        {resource.author && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <User className="h-4 w-4" />
            by {resource.author}
          </div>
        )}

        {resource.progress !== undefined && resource.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{resource.progress}%</span>
            </div>
            <Progress value={resource.progress} className="h-2" />
          </div>
        )}

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {onStart && (
            <Button
              onClick={() => onStart(resource.id)}
              size="sm"
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              {resource.progress === 100 ? 'Review' : resource.progress ? 'Continue' : 'Start'}
            </Button>
          )}
          {resource.url && resource.url !== '#' && (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
