// Types for our unified resource format
export interface Resource {
  id: string
  title: string
  description: string
  subject: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  format: 'book' | 'article' | 'video' | 'quiz' | 'interactive'
  url: string
  thumbnail?: string
  author?: string
  provider: 'open-library' | 'europeana' | 'trivia' | 'ai-generated'
  tags: string[]
  createdAt: string
  progress?: number
  bookmarked?: boolean
  quizData?: {
    question: string
    correctAnswer: string
    incorrectAnswers: string[]
    category: string
    difficulty: string
  }
  aiContent?: {
    content: string
    keyPoints: string[]
    exercises: string[]
  }
}

// Open Library API types
interface OpenLibraryWork {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  subject?: string[]
  cover_i?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryWork[]
  numFound: number
}

// Europeana API types
interface EuropeanaItem {
  id: string
  title: string[]
  dcCreator?: string[]
  dcDescription?: string[]
  dcSubject?: string[]
  edmPreview?: string[]
  guid: string
  type: string
}

interface EuropeanaResponse {
  items: EuropeanaItem[]
  totalResults: number
}

// Trivia API types
interface TriviaQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

class ResourceService {
  private static instance: ResourceService
  
  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService()
    }
    return ResourceService.instance
  }

  // Open Library API
  async searchOpenLibrary(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,first_publish_year,subject,cover_i`
      )
      
      if (!response.ok) {
        throw new Error(`Open Library API error: ${response.status}`)
      }
      
      const data: OpenLibraryResponse = await response.json()
      
      return data.docs.map(book => ({
        id: `ol-${book.key.replace('/works/', '')}`,
        title: book.title,
        description: `Published in ${book.first_publish_year || 'Unknown year'}. ${book.subject?.slice(0, 3).join(', ') || 'Various topics'}.`,
        subject: this.categorizeSubject(book.subject?.[0] || 'General'),
        difficulty: this.inferDifficulty(book.title, book.subject),
        format: 'book' as const,
        url: `https://openlibrary.org${book.key}`,
        thumbnail: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : undefined,
        author: book.author_name?.[0],
        provider: 'open-library' as const,
        tags: book.subject?.slice(0, 5) || [],
        createdAt: new Date().toISOString(),
        progress: 0,
        bookmarked: false
      }))
    } catch (error) {
      console.error('Open Library search error:', error)
      return []
    }
  }

  // Europeana API (Cultural Heritage)
  async searchEuropeana(query: string, limit: number = 20): Promise<Resource[]> {
    try {
      // Europeana has a public API that doesn't require authentication for basic searches
      const response = await fetch(
        `https://www.europeana.eu/api/v2/search.json?wskey=api2demo&query=${encodeURIComponent(query)}&rows=${limit}&profile=rich`
      )
      
      if (!response.ok) {
        throw new Error(`Europeana API error: ${response.status}`)
      }
      
      const data: EuropeanaResponse = await response.json()
      
      return data.items?.map(item => ({
        id: `eu-${item.id.replace('/', '-')}`,
        title: Array.isArray(item.title) ? item.title[0] : item.title || 'Untitled',
        description: Array.isArray(item.dcDescription) ? item.dcDescription[0] : item.dcDescription?.[0] || 'Cultural heritage item from Europeana.',
        subject: this.categorizeSubject(Array.isArray(item.dcSubject) ? item.dcSubject[0] : item.dcSubject?.[0] || 'Culture'),
        difficulty: 'intermediate' as const,
        format: this.mapEuropeanaType(item.type),
        url: item.guid,
        thumbnail: Array.isArray(item.edmPreview) ? item.edmPreview[0] : item.edmPreview?.[0],
        author: Array.isArray(item.dcCreator) ? item.dcCreator[0] : item.dcCreator?.[0],
        provider: 'europeana' as const,
        tags: Array.isArray(item.dcSubject) ? item.dcSubject.slice(0, 5) : (item.dcSubject ? [item.dcSubject] : []),
        createdAt: new Date().toISOString(),
        progress: 0,
        bookmarked: false
      })) || []
    } catch (error) {
      console.error('Europeana search error:', error)
      return []
    }
  }

  // Trivia API (for quiz content)
  async getTrivia(category?: string, difficulty?: string, amount: number = 10): Promise<Resource[]> {
    try {
      let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`
      
      if (category) {
        // Map category names to trivia API category IDs
        const categoryMap: Record<string, number> = {
          'science': 17,
          'history': 23,
          'geography': 22,
          'literature': 10,
          'mathematics': 19,
          'art': 25,
          'sports': 21,
          'entertainment': 11
        }
        const categoryId = categoryMap[category.toLowerCase()]
        if (categoryId) url += `&category=${categoryId}`
      }
      
      if (difficulty) {
        url += `&difficulty=${difficulty}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Trivia API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.response_code !== 0) {
        throw new Error(`Trivia API response error: ${data.response_code}`)
      }
      
      return data.results.map((question: TriviaQuestion, index: number) => ({
        id: `trivia-${Date.now()}-${index}`,
        title: `Quiz: ${question.category}`,
        description: this.decodeHtml(question.question),
        subject: this.categorizeSubject(question.category),
        difficulty: question.difficulty as 'beginner' | 'intermediate' | 'advanced',
        format: 'quiz' as const,
        url: '#', // Will be handled by the quiz component
        author: 'Open Trivia Database',
        provider: 'trivia' as const,
        tags: [question.category, question.type, question.difficulty],
        createdAt: new Date().toISOString(),
        progress: 0,
        bookmarked: false,
        // Store quiz data for the quiz component
        quizData: {
          question: this.decodeHtml(question.question),
          correctAnswer: this.decodeHtml(question.correct_answer),
          incorrectAnswers: question.incorrect_answers.map(ans => this.decodeHtml(ans)),
          category: question.category,
          difficulty: question.difficulty
        }
      }))
    } catch (error) {
      console.error('Trivia API error:', error)
      return []
    }
  }

  // AI-generated content using Gemini
  async generateAIContent(topic: string, subject: string, difficulty: string): Promise<Resource[]> {
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          subject,
          difficulty
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()
      
      return [{
        id: `ai-${Date.now()}`,
        title: data.title,
        description: data.description,
        subject: this.categorizeSubject(subject),
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        format: 'article' as const,
        url: '#',
        provider: 'ai-generated' as const,
        tags: data.tags || [topic, subject],
        createdAt: new Date().toISOString(),
        progress: 0,
        bookmarked: false,
        aiContent: {
          content: data.content,
          keyPoints: data.keyPoints,
          exercises: data.exercises
        }
      }]
    } catch (error) {
      console.error('AI content generation error:', error)
      return []
    }
  }

  // Combined search across all providers
  async searchAllProviders(query: string): Promise<Resource[]> {
    const [openLibraryResults, europeanaResults, triviaResults] = await Promise.allSettled([
      this.searchOpenLibrary(query, 10),
      this.searchEuropeana(query, 10),
      this.getTrivia(query, undefined, 5)
    ])

    const results: Resource[] = []
    
    if (openLibraryResults.status === 'fulfilled') {
      results.push(...openLibraryResults.value)
    }
    
    if (europeanaResults.status === 'fulfilled') {
      results.push(...europeanaResults.value)
    }
    
    if (triviaResults.status === 'fulfilled') {
      results.push(...triviaResults.value)
    }

    return results
  }

  // Helper methods
  private categorizeSubject(subject: string): string {
    const subjectMap: Record<string, string> = {
      'science': 'Science',
      'history': 'History',
      'geography': 'Geography',
      'literature': 'Literature',
      'mathematics': 'Mathematics',
      'math': 'Mathematics',
      'art': 'Art',
      'music': 'Music',
      'sports': 'Sports',
      'technology': 'Technology',
      'computer': 'Technology',
      'programming': 'Technology',
      'biology': 'Science',
      'chemistry': 'Science',
      'physics': 'Science',
      'psychology': 'Psychology',
      'philosophy': 'Philosophy',
      'culture': 'Culture',
      'entertainment': 'Entertainment'
    }

    const normalized = subject.toLowerCase()
    for (const [key, value] of Object.entries(subjectMap)) {
      if (normalized.includes(key)) {
        return value
      }
    }
    
    return 'General'
  }

  private inferDifficulty(title: string, subjects?: string[]): 'beginner' | 'intermediate' | 'advanced' {
    const titleLower = title.toLowerCase()
    const subjectText = subjects?.join(' ').toLowerCase() || ''
    
    if (titleLower.includes('introduction') || titleLower.includes('basic') || 
        titleLower.includes('beginner') || titleLower.includes('elementary') ||
        titleLower.includes('simple') || subjectText.includes('children')) {
      return 'beginner'
    }
    
    if (titleLower.includes('advanced') || titleLower.includes('expert') || 
        titleLower.includes('professional') || titleLower.includes('graduate') ||
        titleLower.includes('research') || titleLower.includes('PhD')) {
      return 'advanced'
    }
    
    return 'intermediate'
  }

  private mapEuropeanaType(type: string): Resource['format'] {
    const typeMap: Record<string, Resource['format']> = {
      'TEXT': 'article',
      'IMAGE': 'article',
      'VIDEO': 'video',
      'SOUND': 'article',
      '3D': 'interactive'
    }
    
    return typeMap[type] || 'article'
  }

  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }
}

export default ResourceService
