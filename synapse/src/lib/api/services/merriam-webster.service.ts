import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for dictionary entry
export const DictionaryEntrySchema = z.object({
  meta: z.object({
    id: z.string(),
    uuid: z.string(),
    sort: z.string(),
    src: z.string(),
    section: z.string(),
    stems: z.array(z.string()),
    offensive: z.boolean().optional(),
  }),
  hwi: z.object({
    hw: z.string(),
    prs: z.array(z.object({
      mw: z.string(),
      sound: z.object({
        audio: z.string(),
        ref: z.string(),
        stat: z.string(),
      }).optional(),
    })).optional(),
  }),
  fl: z.string(),
  def: z.array(z.object({
    sseq: z.array(z.any()),
  })),
  shortdef: z.array(z.string()),
});

// Schema for thesaurus entry
export const ThesaurusEntrySchema = z.object({
  meta: z.object({
    id: z.string(),
    syns: z.array(z.array(z.string())).optional(),
    ants: z.array(z.array(z.string())).optional(),
    offensive: z.boolean().optional(),
  }),
  hwi: z.object({
    hw: z.string(),
  }),
  fl: z.string(),
  def: z.array(z.object({
    sseq: z.array(z.any()),
  })),
  shortdef: z.array(z.string()),
});

// Schema for word of the day
export const WordOfTheDaySchema = z.object({
  word: z.string(),
  definitions: z.array(z.string()),
  examples: z.array(z.string()).optional(),
  date: z.string(),
  note: z.string().optional(),
});

export type DictionaryEntry = z.infer<typeof DictionaryEntrySchema>;
export type ThesaurusEntry = z.infer<typeof ThesaurusEntrySchema>;
export type WordOfTheDay = z.infer<typeof WordOfTheDaySchema>;

/**
 * Service for interacting with the Merriam-Webster Dictionary and Thesaurus APIs
 * API Documentation: https://dictionaryapi.com/
 * 
 * To use this service, you'll need to sign up for API keys at:
 * - Dictionary API: https://dictionaryapi.com/products/api-collegiate-dictionary
 * - Thesaurus API: https://dictionaryapi.com/products/api-collegiate-thesaurus
 */
export class MerriamWebsterService extends BaseHttpService {
  private static readonly DICTIONARY_BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';
  private static readonly THESAURUS_BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json';
  
  private dictionaryApiKey: string;
  private thesaurusApiKey: string;

  /**
   * Create a new instance of the Merriam-Webster service
   * @param dictionaryApiKey Your Merriam-Webster Dictionary API key
   * @param thesaurusApiKey Your Merriam-Webster Thesaurus API key (optional)
   */
  constructor(dictionaryApiKey: string, thesaurusApiKey?: string) {
    super('', {
      'Accept': 'application/json',
    });
    
    if (!dictionaryApiKey) {
      throw new Error('Merriam-Webster Dictionary API key is required');
    }
    
    this.dictionaryApiKey = dictionaryApiKey;
    this.thesaurusApiKey = thesaurusApiKey || '';
  }

  /**
   * Look up a word in the dictionary
   * @param word The word to look up
   */
  async lookupDictionary(word: string): Promise<DictionaryEntry[]> {
    const encodedWord = encodeURIComponent(word.toLowerCase());
    const url = `${MerriamWebsterService.DICTIONARY_BASE_URL}/${encodedWord}?key=${this.dictionaryApiKey}`;
    
    return this.get<DictionaryEntry[]>(
      url,
      { baseURL: '' }, // Override baseURL for this request
      z.array(DictionaryEntrySchema)
    );
  }

  /**
   * Look up synonyms and antonyms in the thesaurus
   * @param word The word to look up
   */
  async lookupThesaurus(word: string): Promise<ThesaurusEntry[]> {
    if (!this.thesaurusApiKey) {
      throw new Error('Thesaurus API key is required for thesaurus lookups');
    }
    
    const encodedWord = encodeURIComponent(word.toLowerCase());
    const url = `${MerriamWebsterService.THESAURUS_BASE_URL}/${encodedWord}?key=${this.thesaurusApiKey}`;
    
    return this.get<ThesaurusEntry[]>(
      url,
      { baseURL: '' }, // Override baseURL for this request
      z.array(ThesaurusEntrySchema)
    );
  }

  /**
   * Get the word of the day
   * Note: This is a simplified implementation that returns a random word
   * since the official API doesn't have a direct word of the day endpoint
   */
  async getWordOfTheDay(): Promise<WordOfTheDay> {
    // Common words to use as fallback
    const commonWords = [
      'serendipity', 'ephemeral', 'quintessential', 'eloquent', 'resilient',
      'ubiquitous', 'mellifluous', 'luminous', 'petrichor', 'aurora'
    ];
    
    const randomWord = commonWords[Math.floor(Math.random() * commonWords.length)];
    
    try {
      const entries = await this.lookupDictionary(randomWord);
      if (entries.length > 0) {
        const entry = entries[0];
        return {
          word: entry.meta.id,
          definitions: entry.shortdef,
          date: new Date().toISOString().split('T')[0],
          note: 'Random word of the day',
        };
      }
    } catch (error) {
      console.error('Error getting word of the day:', error);
    }
    
    // Fallback if API call fails
    return {
      word: randomWord,
      definitions: [`The quality of being ${randomWord}.`],
      date: new Date().toISOString().split('T')[0],
      note: 'Random word of the day (fallback)',
    };
  }

  /**
   * Get synonyms for a word
   * @param word The word to get synonyms for
   */
  async getSynonyms(word: string): Promise<string[]> {
    const entries = await this.lookupThesaurus(word);
    if (entries.length === 0) return [];
    
    const synonyms: string[] = [];
    
    for (const entry of entries) {
      if (entry.meta.syns) {
        for (const synGroup of entry.meta.syns) {
          synonyms.push(...synGroup);
        }
      }
    }
    
    return [...new Set(synonyms)]; // Remove duplicates
  }

  /**
   * Get antonyms for a word
   * @param word The word to get antonyms for
   */
  async getAntonyms(word: string): Promise<string[]> {
    const entries = await this.lookupThesaurus(word);
    if (entries.length === 0) return [];
    
    const antonyms: string[] = [];
    
    for (const entry of entries) {
      if (entry.meta.ants) {
        for (const antGroup of entry.meta.ants) {
          antonyms.push(...antGroup);
        }
      }
    }
    
    return [...new Set(antonyms)]; // Remove duplicates
  }

  /**
   * Get the pronunciation of a word
   * @param word The word to get pronunciation for
   */
  async getPronunciation(word: string): Promise<string | null> {
    const entries = await this.lookupDictionary(word);
    if (entries.length === 0) return null;
    
    const entry = entries[0];
    if (entry.hwi.prs && entry.hwi.prs.length > 0) {
      return entry.hwi.prs[0].mw;
    }
    
    return null;
  }

  /**
   * Check if a word exists in the dictionary
   * @param word The word to check
   */
  async isWordValid(word: string): Promise<boolean> {
    try {
      const entries = await this.lookupDictionary(word);
      return entries.length > 0 && entries[0].meta.id === word.toLowerCase();
    } catch (error) {
      console.error('Error checking word validity:', error);
      return false;
    }
  }
}
