import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for Wikipedia API response
export const WikipediaSearchResultSchema = z.object({
  query: z.object({
    search: z.array(z.object({
      ns: z.number(),
      title: z.string(),
      pageid: z.number(),
      size: z.number(),
      wordcount: z.number(),
      snippet: z.string(),
      timestamp: z.string(),
    })),
  }),
});

export const WikipediaPageSchema = z.object({
  query: z.object({
    pages: z.record(z.string(), z.object({
      pageid: z.number(),
      ns: z.number(),
      title: z.string(),
      extract: z.string().optional(),
      fullurl: z.string().optional(),
      thumbnail: z.object({
        source: z.string(),
        width: z.number(),
        height: z.number(),
      }).optional(),
    })),
  }),
});

export type WikipediaSearchResult = z.infer<typeof WikipediaSearchResultSchema>;
export type WikipediaPage = z.infer<typeof WikipediaPageSchema>;

export class WikipediaService extends BaseHttpService {
  private static readonly BASE_URL = 'https://en.wikipedia.org/w/api.php';

  constructor() {
    super(WikipediaService.BASE_URL, {
      'User-Agent': 'Synapse-Education-Platform/1.0 (your-email@example.com)',
    });
  }

  /**
   * Search Wikipedia articles
   * @param query Search query
   * @param limit Maximum number of results (default: 10, max: 50)
   */
  async search(query: string, limit = 10): Promise<WikipediaSearchResult> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      format: 'json',
      origin: '*',
      srsearch: query,
      srlimit: Math.min(limit, 50).toString(),
      utf8: '',
      formatversion: '2',
    });

    return this.get<WikipediaSearchResult>(
      `?${params.toString()}`,
      {},
      WikipediaSearchResultSchema
    );
  }

  /**
   * Get a Wikipedia page by its title
   * @param title Page title
   * @param extract Whether to include the page extract (default: true)
   * @param thumbnail Whether to include a thumbnail (default: true)
   */
  async getPage(
    title: string,
    extract = true,
    thumbnail = true
  ): Promise<WikipediaPage> {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'extracts|pageimages|info',
      format: 'json',
      origin: '*',
      titles: title,
      explaintext: '1',
      exintro: '1',
      inprop: 'url',
      formatversion: '2',
    });

    if (extract) {
      params.set('exintro', '1');
      params.set('explaintext', '1');
    }

    if (thumbnail) {
      params.set('pithumbsize', '300');
    }

    return this.get<WikipediaPage>(
      `?${params.toString()}`,
      {},
      WikipediaPageSchema
    );
  }

  /**
   * Get a random Wikipedia article
   */
  async getRandomArticle(): Promise<WikipediaPage> {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'random',
      grnnamespace: '0', // Main namespace
      grnlimit: '1',
      prop: 'extracts|pageimages|info',
      format: 'json',
      origin: '*',
      explaintext: '1',
      exintro: '1',
      inprop: 'url',
      formatversion: '2',
    });

    return this.get<WikipediaPage>(
      `?${params.toString()}`,
      {},
      WikipediaPageSchema
    );
  }

  /**
   * Get a summary of a Wikipedia article (first paragraph)
   * @param title Article title
   */
  async getSummary(title: string): Promise<string | null> {
    try {
      const response = await this.getPage(title, true, false);
      const page = Object.values(response.query.pages)[0];
      return page.extract || null;
    } catch (error) {
      console.error('Error getting Wikipedia summary:', error);
      return null;
    }
  }
}
