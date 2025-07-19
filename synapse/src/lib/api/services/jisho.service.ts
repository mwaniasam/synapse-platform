import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for Jisho API response
export const JishoWordSchema = z.object({
  slug: z.string(),
  is_common: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  jlpt: z.array(z.string()).optional(),
  japanese: z.array(z.object({
    word: z.string().optional(),
    reading: z.string().optional(),
  })),
  senses: z.array(z.object({
    english_definitions: z.array(z.string()),
    parts_of_speech: z.array(z.string()),
    links: z.array(z.object({
      text: z.string(),
      url: z.string(),
    })).optional(),
    tags: z.array(z.string()).optional(),
    restrictions: z.array(z.string()).optional(),
    see_also: z.array(z.string()).optional(),
    antonyms: z.array(z.string()).optional(),
    source: z.array(z.object({
      language: z.string(),
      word: z.string(),
    })).optional(),
    info: z.array(z.string()).optional(),
  })),
  attribution: z.string().optional(),
});

export const JishoResponseSchema = z.object({
  meta: z.object({
    status: z.number(),
  }),
  data: z.array(JishoWordSchema),
});

export type JishoWord = z.infer<typeof JishoWordSchema>;
export type JishoResponse = z.infer<typeof JishoResponseSchema>;

/**
 * Service for interacting with the Jisho API
 * This is an unofficial wrapper around the Jisho.org API
 * No API key is required.
 */
export class JishoService extends BaseHttpService {
  private static readonly BASE_URL = 'https://jisho.org/api/v1';

  constructor() {
    super(JishoService.BASE_URL, {
      'User-Agent': 'Synapse-Education-Platform/1.0 (your-email@example.com)',
    });
  }

  /**
   * Search for a Japanese word or phrase
   * @param query The word or phrase to search for
   */
  async search(query: string): Promise<JishoResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.get<JishoResponse>(
      `/search/words?keyword=${encodedQuery}`,
      {},
      JishoResponseSchema
    );
  }

  /**
   * Search for a kanji character
   * @param kanji The kanji character to look up
   */
  async searchKanji(kanji: string): Promise<any> {
    if (kanji.length !== 1) {
      throw new Error('Only single kanji characters are supported');
    }

    const encodedKanji = encodeURIComponent(kanji);
    return this.get<any>(
      `/search/kanji?keyword=${encodedKanji}`,
      {},
      z.any()
    );
  }

  /**
   * Get words by their reading (hiragana/katakana)
   * @param reading The reading to search for
   */
  async searchByReading(reading: string): Promise<JishoResponse> {
    const encodedReading = encodeURIComponent(reading);
    return this.get<JishoResponse>(
      `/search/words?keyword=${encodedReading}&keyword_type=reading`,
      {},
      JishoResponseSchema
    );
  }

  /**
   * Get common words that match the query
   * @param query The word or phrase to search for
   */
  async searchCommonWords(query: string): Promise<JishoWord[]> {
    const response = await this.search(query);
    return response.data.filter(word => word.is_common);
  }

  /**
   * Get example sentences for a word
   * @param query The word to get examples for
   */
  async getExamples(query: string): Promise<any> {
    const encodedQuery = encodeURIComponent(query);
    return this.get<any>(
      `/search/examples?keyword=${encodedQuery}`,
      {},
      z.any()
    );
  }

  /**
   * Get words by JLPT level
   * @param level JLPT level (N5, N4, N3, N2, N1)
   */
  async getByJlptLevel(level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'): Promise<JishoResponse> {
    return this.get<JishoResponse>(
      `/search/words?keyword=%23${level}`,
      {},
      JishoResponseSchema
    );
  }

  /**
   * Get words by part of speech
   * @param partOfSpeech The part of speech to filter by (e.g., 'noun', 'verb')
   */
  async getByPartOfSpeech(partOfSpeech: string): Promise<JishoResponse> {
    const encodedPos = encodeURIComponent(partOfSpeech);
    return this.get<JishoResponse>(
      `/search/words?keyword=%23${encodedPos}`,
      {},
      JishoResponseSchema
    );
  }

  /**
   * Get a random word from Jisho
   */
  async getRandomWord(): Promise<JishoWord | null> {
    try {
      // Common kanji for random word generation
      const commonKanji = '日一人年大十二本中出三見月生五時国行後前合立内二事社者地間市場所田七東九小八六上旬水火山話手分夕立川千水半男北午百書力母語学外長明円高来白中校見間市立木気年小上白山川
      ';
      
      // Pick a random kanji
      const randomKanji = commonKanji[Math.floor(Math.random() * commonKanji.length)];
      const response = await this.search(randomKanji);
      
      if (response.data.length > 0) {
        // Return a random word from the results
        return response.data[Math.floor(Math.random() * response.data.length)];
      }
      
      return null;
    } catch (error) {
      console.error('Error getting random word:', error);
      return null;
    }
  }
}
