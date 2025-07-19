import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for number facts
export const NumberFactSchema = z.object({
  text: z.string(),
  number: z.union([z.number(), z.string()]),
  found: z.boolean(),
  type: z.string(),
  date: z.string().optional(),
  year: z.number().optional(),
});

export type NumberFact = z.infer<typeof NumberFactSchema>;

/**
 * Service for interacting with the Numbers API (http://numbersapi.com/)
 * This service provides interesting facts about numbers, dates, and years.
 * No API key is required for basic usage.
 */
export class NumbersService extends BaseHttpService {
  private static readonly BASE_URL = 'http://numbersapi.com';

  constructor() {
    super(NumbersService.BASE_URL, {
      'Content-Type': 'application/json',
    });
  }

  /**
   * Get a fact about a specific number
   * @param number The number to get a fact about
   * @param type The type of fact (trivia, math, date, year) - default: trivia
   */
  async getNumberFact(
    number: number | 'random',
    type: 'trivia' | 'math' | 'date' | 'year' = 'trivia'
  ): Promise<NumberFact> {
    const url = `/${number}/${type}?json`;
    return this.get<NumberFact>(url, {}, NumberFactSchema);
  }

  /**
   * Get a fact about a specific date (e.g., 1/1 for January 1st)
   * @param month The month (1-12)
   * @param day The day of the month (1-31)
   */
  async getDateFact(month: number, day: number): Promise<NumberFact> {
    const url = `/${month}/${day}/date?json`;
    return this.get<NumberFact>(url, {}, NumberFactSchema);
  }

  /**
   * Get a fact about a specific year
   * @param year The year to get a fact about
   */
  async getYearFact(year: number | 'random'): Promise<NumberFact> {
    const url = `/${year}/year?json`;
    return this.get<NumberFact>(url, {}, NumberFactSchema);
  }

  /**
   * Get a random math fact
   */
  async getRandomMathFact(): Promise<NumberFact> {
    return this.getNumberFact('random', 'math');
  }

  /**
   * Get a random trivia fact
   */
  async getRandomTriviaFact(): Promise<NumberFact> {
    return this.getNumberFact('random', 'trivia');
  }

  /**
   * Get a fact about today's date
   */
  async getTodaysDateFact(): Promise<NumberFact> {
    const today = new Date();
    const month = today.getMonth() + 1; // getMonth() is 0-indexed
    const day = today.getDate();
    return this.getDateFact(month, day);
  }

  /**
   * Get multiple number facts in a single request
   * @param numbers Array of numbers to get facts about
   * @param type Type of facts to get (trivia or math)
   */
  async getMultipleNumberFacts(
    numbers: (number | string)[],
    type: 'trivia' | 'math' = 'trivia'
  ): Promise<Record<string, string>> {
    if (numbers.length === 0) {
      throw new Error('At least one number is required');
    }

    // Numbers API expects comma-separated values for multiple numbers
    const numbersParam = numbers.join(',');
    const url = `/${numbersParam}/${type}?json`;
    
    // The response for multiple numbers is a record of number: fact
    const schema = z.record(z.string());
    return this.get<Record<string, string>>(url, {}, schema);
  }
}
