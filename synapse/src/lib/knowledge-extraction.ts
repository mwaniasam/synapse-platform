export interface ConceptNode {
  id: string
  concept: string
  domain: string
  weight: number
  url?: string
  context: string
  extractedAt: Date
}

export interface ConceptRelation {
  source: string
  target: string
  strength: number
  type: "semantic" | "contextual" | "temporal" | "hierarchical"
}

export class KnowledgeExtractionEngine {
  private stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "this",
    "that",
    "these",
    "those",
  ])

  private technicalTerms = new Set([
    "algorithm",
    "machine learning",
    "artificial intelligence",
    "neural network",
    "deep learning",
    "data science",
    "programming",
    "software",
    "database",
    "api",
    "framework",
    "library",
    "javascript",
    "python",
    "react",
    "node.js",
    "typescript",
    "css",
    "html",
    "sql",
  ])

  public extractConcepts(text: string, url?: string): ConceptNode[] {
    const sentences = this.splitIntoSentences(text)
    const concepts: ConceptNode[] = []

    sentences.forEach((sentence, index) => {
      const extractedConcepts = this.extractConceptsFromSentence(sentence)

      extractedConcepts.forEach((concept) => {
        concepts.push({
          id: this.generateId(concept),
          concept,
          domain: this.classifyDomain(concept, sentence),
          weight: this.calculateWeight(concept, sentence, text),
          url,
          context: sentence,
          extractedAt: new Date(),
        })
      })
    })

    return this.deduplicateAndMerge(concepts)
  }

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim().length > 10)
  }

  private extractConceptsFromSentence(sentence: string): string[] {
    const concepts: string[] = []

    // Extract technical terms
    this.technicalTerms.forEach((term) => {
      if (sentence.toLowerCase().includes(term)) {
        concepts.push(term)
      }
    })

    // Extract noun phrases (simplified)
    const words = sentence.toLowerCase().split(/\s+/)
    const nounPhrases = this.extractNounPhrases(words)
    concepts.push(...nounPhrases)

    // Extract capitalized terms (likely proper nouns/concepts)
    const capitalizedTerms = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || []
    concepts.push(...capitalizedTerms.filter((term) => term.length > 2))

    return [...new Set(concepts)] // Remove duplicates
  }

  private extractNounPhrases(words: string[]): string[] {
    const phrases: string[] = []
    let currentPhrase: string[] = []

    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "")

      if (this.stopWords.has(cleanWord) || cleanWord.length < 3) {
        if (currentPhrase.length > 0) {
          phrases.push(currentPhrase.join(" "))
          currentPhrase = []
        }
      } else {
        currentPhrase.push(cleanWord)
      }
    })

    if (currentPhrase.length > 0) {
      phrases.push(currentPhrase.join(" "))
    }

    return phrases.filter((phrase) => phrase.split(" ").length <= 3) // Max 3 words
  }

  private classifyDomain(concept: string, context: string): string {
    const domainKeywords = {
      "Computer Science": ["programming", "algorithm", "software", "code", "development", "api", "database"],
      "Machine Learning": ["neural", "model", "training", "prediction", "classification", "regression"],
      "Web Development": ["html", "css", "javascript", "react", "frontend", "backend", "framework"],
      "Data Science": ["data", "analysis", "statistics", "visualization", "dataset", "analytics"],
      Mathematics: ["equation", "formula", "theorem", "proof", "calculation", "function"],
      Science: ["research", "experiment", "hypothesis", "theory", "study", "analysis"],
    }

    const lowerContext = context.toLowerCase()
    const lowerConcept = concept.toLowerCase()

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some((keyword) => lowerContext.includes(keyword) || lowerConcept.includes(keyword))) {
        return domain
      }
    }

    return "General"
  }

  private calculateWeight(concept: string, sentence: string, fullText: string): number {
    let weight = 1

    // Increase weight for technical terms
    if (this.technicalTerms.has(concept.toLowerCase())) {
      weight += 2
    }

    // Increase weight for frequency in text
    const frequency = (fullText.toLowerCase().match(new RegExp(concept.toLowerCase(), "g")) || []).length
    weight += Math.log(frequency + 1)

    // Increase weight for position (earlier = more important)
    const position = fullText.toLowerCase().indexOf(concept.toLowerCase())
    const relativePosition = position / fullText.length
    weight += (1 - relativePosition) * 0.5

    // Increase weight for capitalization
    if (concept[0] === concept[0].toUpperCase()) {
      weight += 0.5
    }

    return Math.min(weight, 10) // Cap at 10
  }

  private generateId(concept: string): string {
    return concept
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  private deduplicateAndMerge(concepts: ConceptNode[]): ConceptNode[] {
    const conceptMap = new Map<string, ConceptNode>()

    concepts.forEach((concept) => {
      const existing = conceptMap.get(concept.id)
      if (existing) {
        existing.weight = Math.max(existing.weight, concept.weight)
        existing.context += "; " + concept.context
      } else {
        conceptMap.set(concept.id, concept)
      }
    })

    return Array.from(conceptMap.values())
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 50) // Keep top 50 concepts
  }

  public findRelations(concepts: ConceptNode[]): ConceptRelation[] {
    const relations: ConceptRelation[] = []

    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const relation = this.calculateRelation(concepts[i], concepts[j])
        if (relation.strength > 0.3) {
          // Only keep strong relations
          relations.push(relation)
        }
      }
    }

    return relations.sort((a, b) => b.strength - a.strength).slice(0, 100) // Top 100 relations
  }

  private calculateRelation(concept1: ConceptNode, concept2: ConceptNode): ConceptRelation {
    let strength = 0
    let type: ConceptRelation["type"] = "semantic"

    // Same domain bonus
    if (concept1.domain === concept2.domain) {
      strength += 0.3
      type = "contextual"
    }

    // Context similarity
    const contextSimilarity = this.calculateContextSimilarity(concept1.context, concept2.context)
    strength += contextSimilarity * 0.4

    // Semantic similarity (simplified)
    const semanticSimilarity = this.calculateSemanticSimilarity(concept1.concept, concept2.concept)
    strength += semanticSimilarity * 0.3

    // Temporal proximity
    const timeDiff = Math.abs(concept1.extractedAt.getTime() - concept2.extractedAt.getTime())
    const temporalBonus = Math.max(0, 1 - timeDiff / (1000 * 60 * 60)) // 1 hour window
    strength += temporalBonus * 0.2

    if (temporalBonus > 0.5) {
      type = "temporal"
    }

    return {
      source: concept1.id,
      target: concept2.id,
      strength: Math.min(strength, 1),
      type,
    }
  }

  private calculateContextSimilarity(context1: string, context2: string): number {
    const words1 = new Set(context1.toLowerCase().split(/\s+/))
    const words2 = new Set(context2.toLowerCase().split(/\s+/))

    const intersection = new Set([...words1].filter((x) => words2.has(x)))
    const union = new Set([...words1, ...words2])

    return intersection.size / union.size // Jaccard similarity
  }

  private calculateSemanticSimilarity(concept1: string, concept2: string): number {
    // Simplified semantic similarity based on word overlap and common patterns
    const words1 = concept1.toLowerCase().split(/\s+/)
    const words2 = concept2.toLowerCase().split(/\s+/)

    let similarity = 0

    // Check for word overlap
    const overlap = words1.filter((word) => words2.includes(word)).length
    similarity += overlap / Math.max(words1.length, words2.length)

    // Check for common prefixes/suffixes
    if (this.shareCommonAffix(concept1, concept2)) {
      similarity += 0.2
    }

    return Math.min(similarity, 1)
  }

  private shareCommonAffix(word1: string, word2: string): boolean {
    const minLength = 3

    // Check prefixes
    for (let i = minLength; i <= Math.min(word1.length, word2.length); i++) {
      if (word1.substring(0, i) === word2.substring(0, i)) {
        return true
      }
    }

    // Check suffixes
    for (let i = minLength; i <= Math.min(word1.length, word2.length); i++) {
      if (word1.substring(word1.length - i) === word2.substring(word2.length - i)) {
        return true
      }
    }

    return false
  }
}
