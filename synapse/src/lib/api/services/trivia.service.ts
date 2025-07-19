import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for Open Trivia DB API response
export const TriviaCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TriviaQuestionSchema = z.object({
  category: z.string(),
  type: z.union([z.literal('multiple'), z.literal('boolean')]),
  difficulty: z.union([
    z.literal('easy'),
    z.literal('medium'),
    z.literal('hard'),
  ]),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.array(z.string()),
});

export const TriviaResponseSchema = z.object({
  response_code: z.number(),
  results: z.array(TriviaQuestionSchema),
});

export type TriviaCategory = z.infer<typeof TriviaCategorySchema>;
export type TriviaQuestion = z.infer<typeof TriviaQuestionSchema>;
export type TriviaResponse = z.infer<typeof TriviaResponseSchema>;

export type QuestionType = 'multiple' | 'boolean';
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Service for interacting with the Open Trivia Database API
 * Documentation: https://opentdb.com/api_config.php
 */
export class TriviaService extends BaseHttpService {
  private static readonly BASE_URL = 'https://opentdb.com';
  private categories: TriviaCategory[] = [];

  constructor() {
    super(TriviaService.BASE_URL, {
      'Content-Type': 'application/json',
    });
  }

  /**
   * Get all available trivia categories
   */
  async getCategories(): Promise<TriviaCategory[]> {
    if (this.categories.length > 0) {
      return this.categories;
    }

    const response = await this.get<{ trivia_categories: TriviaCategory[] }>(
      '/api_category.php',
      {},
      z.object({ trivia_categories: z.array(TriviaCategorySchema) })
    );

    this.categories = response.trivia_categories;
    return this.categories;
  }

  /**
   * Get a list of questions
   * @param amount Number of questions to return (1-50, default: 10)
   * @param categoryId Category ID (optional)
   * @param difficulty Difficulty level (easy, medium, hard) - optional
   * @param type Question type (multiple, boolean) - optional
   */
  async getQuestions(
    amount = 10,
    categoryId?: number,
    difficulty?: Difficulty,
    type?: QuestionType
  ): Promise<TriviaQuestion[]> {
    const params = new URLSearchParams({
      amount: Math.min(Math.max(amount, 1), 50).toString(),
      encode: 'url3986', // URL-encoded format for special characters
    });

    if (categoryId) {
      params.set('category', categoryId.toString());
    }

    if (difficulty) {
      params.set('difficulty', difficulty);
    }

    if (type) {
      params.set('type', type);
    }

    const response = await this.get<TriviaResponse>(
      `/api.php?${params.toString()}`,
      {},
      TriviaResponseSchema
    );

    // Decode URL-encoded strings
    return response.results.map((question) => ({
      ...question,
      category: decodeURIComponent(question.category),
      question: decodeURIComponent(question.question),
      correct_answer: decodeURIComponent(question.correct_answer),
      incorrect_answers: question.incorrect_answers.map(decodeURIComponent),
    }));
  }

  /**
   * Get a random question
   */
  async getRandomQuestion(
    categoryId?: number,
    difficulty?: Difficulty,
    type?: QuestionType
  ): Promise<TriviaQuestion | null> {
    const questions = await this.getQuestions(1, categoryId, difficulty, type);
    return questions[0] || null;
  }

  /**
   * Get questions from a specific category
   * @param categoryId The category ID
   * @param amount Number of questions to return (1-50, default: 10)
   */
  async getQuestionsByCategory(
    categoryId: number,
    amount = 10
  ): Promise<TriviaQuestion[]> {
    return this.getQuestions(amount, categoryId);
  }

  /**
   * Get questions of a specific difficulty
   * @param difficulty Difficulty level
   * @param amount Number of questions to return (1-50, default: 10)
   */
  async getQuestionsByDifficulty(
    difficulty: Difficulty,
    amount = 10
  ): Promise<TriviaQuestion[]> {
    return this.getQuestions(amount, undefined, difficulty);
  }

  /**
   * Get questions of a specific type
   * @param type Question type
   * @param amount Number of questions to return (1-50, default: 10)
   */
  async getQuestionsByType(
    type: QuestionType,
    amount = 10
  ): Promise<TriviaQuestion[]> {
    return this.getQuestions(amount, undefined, undefined, type);
  }

  /**
   * Get a random true/false question
   */
  async getTrueFalseQuestion(
    categoryId?: number,
    difficulty?: Difficulty
  ): Promise<TriviaQuestion | null> {
    return this.getRandomQuestion(categoryId, difficulty, 'boolean');
  }

  /**
   * Get a random multiple-choice question
   */
  async getMultipleChoiceQuestion(
    categoryId?: number,
    difficulty?: Difficulty
  ): Promise<TriviaQuestion | null> {
    return this.getRandomQuestion(categoryId, difficulty, 'multiple');
  }

  /**
   * Get the total number of questions in a category
   * @param categoryId The category ID
   */
  async getCategoryQuestionCount(categoryId: number): Promise<number> {
    try {
      const response = await this.get<{ category_id: number; category_question_count: { total_question_count: number } }>(
        `/api_count.php?category=${categoryId}`,
        {},
        z.object({
          category_id: z.number(),
          category_question_count: z.object({
            total_question_count: z.number(),
          }),
        })
      );
      
      return response.category_question_count.total_question_count;
    } catch (error) {
      console.error('Error getting category question count:', error);
      return 0;
    }
  }
}
