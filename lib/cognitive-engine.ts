export interface CognitiveState {
  focus: number;
  engagement: number;
  comprehension: number;
  fatigue: number;
  confidence: number;
  timestamp: Date;
}

export interface LearningMetrics {
  sessionDuration: number;
  conceptsLearned: number;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpentReading: number;
  interactionFrequency: number;
}

export class CognitiveEngine {
  private static instance: CognitiveEngine;

  public static getInstance(): CognitiveEngine {
    if (!CognitiveEngine.instance) {
      CognitiveEngine.instance = new CognitiveEngine();
    }
    return CognitiveEngine.instance;
  }

  public analyzeCognitiveState(metrics: LearningMetrics): CognitiveState {
    const focus = this.calculateFocus(metrics);
    const engagement = this.calculateEngagement(metrics);
    const comprehension = this.calculateComprehension(metrics);
    const fatigue = this.calculateFatigue(metrics);
    const confidence = this.calculateConfidence(metrics);

    return {
      focus,
      engagement,
      comprehension,
      fatigue,
      confidence,
      timestamp: new Date(),
    };
  }

  private calculateFocus(metrics: LearningMetrics): number {
    const focusScore = Math.min(100, (metrics.interactionFrequency / metrics.sessionDuration) * 100);
    return Math.max(0, focusScore);
  }

  private calculateEngagement(metrics: LearningMetrics): number {
    const engagementScore = (metrics.questionsAnswered / Math.max(1, metrics.sessionDuration / 60)) * 20;
    return Math.min(100, Math.max(0, engagementScore));
  }

  private calculateComprehension(metrics: LearningMetrics): number {
    if (metrics.questionsAnswered === 0) return 50;
    const comprehensionScore = (metrics.correctAnswers / metrics.questionsAnswered) * 100;
    return Math.max(0, comprehensionScore);
  }

  private calculateFatigue(metrics: LearningMetrics): number {
    const fatigueScore = Math.min(100, (metrics.sessionDuration / 3600) * 30);
    return Math.max(0, fatigueScore);
  }

  private calculateConfidence(metrics: LearningMetrics): number {
    const accuracyRate = metrics.questionsAnswered > 0 ? metrics.correctAnswers / metrics.questionsAnswered : 0.5;
    const confidenceScore = accuracyRate * 100;
    return Math.max(0, Math.min(100, confidenceScore));
  }

  public generateRecommendations(cognitiveState: CognitiveState): string[] {
    const recommendations: string[] = [];

    if (cognitiveState.focus < 50) {
      recommendations.push("Take a 5-minute break to improve focus");
      recommendations.push("Try the Pomodoro technique for better concentration");
    }

    if (cognitiveState.engagement < 40) {
      recommendations.push("Switch to more interactive content");
      recommendations.push("Try gamified learning exercises");
    }

    if (cognitiveState.comprehension < 60) {
      recommendations.push("Review previous concepts before continuing");
      recommendations.push("Try explaining concepts in your own words");
    }

    if (cognitiveState.fatigue > 70) {
      recommendations.push("Take a longer break (15-30 minutes)");
      recommendations.push("Consider ending the session and resuming later");
    }

    if (cognitiveState.confidence < 50) {
      recommendations.push("Practice with easier exercises first");
      recommendations.push("Seek additional resources or help");
    }

    return recommendations;
  }

  public adaptContent(cognitiveState: CognitiveState, content: any): any {
    const adaptedContent = { ...content };

    if (cognitiveState.comprehension < 60) {
      adaptedContent.difficulty = 'easy';
      adaptedContent.explanationLevel = 'detailed';
    } else if (cognitiveState.comprehension > 80) {
      adaptedContent.difficulty = 'hard';
      adaptedContent.explanationLevel = 'concise';
    }

    if (cognitiveState.focus < 50) {
      adaptedContent.format = 'interactive';
      adaptedContent.chunkSize = 'small';
    }

    if (cognitiveState.fatigue > 60) {
      adaptedContent.sessionLength = 'short';
      adaptedContent.breakReminders = true;
    }

    return adaptedContent;
  }

  public processNaturalLanguage(text: string): { concepts: string[]; sentiment: string; complexity: number } {
    // Simple NLP processing without external libraries
    const words = text.toLowerCase().split(/\s+/);
    const concepts = this.extractConcepts(words);
    const sentiment = this.analyzeSentiment(words);
    const complexity = this.calculateComplexity(text);

    return { concepts, sentiment, complexity };
  }

  private extractConcepts(words: string[]): string[] {
    const conceptKeywords = [
      'algorithm', 'data', 'structure', 'function', 'variable', 'loop', 'condition',
      'machine', 'learning', 'neural', 'network', 'artificial', 'intelligence',
      'programming', 'code', 'software', 'development', 'computer', 'science'
    ];

    return words.filter(word => conceptKeywords.includes(word));
  }

  private analyzeSentiment(words: string[]): string {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'difficult', 'hard'];

    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateComplexity(text: string): number {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    
    // Simple complexity score based on sentence length
    return Math.min(100, Math.max(0, (avgWordsPerSentence - 10) * 5));
  }
}

export const cognitiveEngine = CognitiveEngine.getInstance();
