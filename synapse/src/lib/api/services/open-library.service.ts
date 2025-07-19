import { z } from 'zod';
import { BaseHttpService } from './base-http.service';

// Schema for Open Library search results
export const OpenLibrarySearchSchema = z.object({
  numFound: z.number(),
  start: z.number(),
  numFoundExact: z.boolean(),
  docs: z.array(z.object({
    key: z.string(),
    title: z.string(),
    first_publish_year: z.number().optional(),
    author_name: z.array(z.string()).optional(),
    author_key: z.array(z.string()).optional(),
    isbn: z.array(z.string()).optional(),
    cover_i: z.number().optional(),
    language: z.array(z.string()).optional(),
    subject: z.array(z.string()).optional(),
    has_fulltext: z.boolean().optional(),
  })),
});

// Schema for Open Library work details
export const OpenLibraryWorkSchema = z.object({
  title: z.string(),
  description: z.union([z.string(), z.object({ value: z.string() })]).optional(),
  first_publish_date: z.string().optional(),
  covers: z.array(z.number()).optional(),
  subjects: z.array(z.string()).optional(),
  subject_places: z.array(z.string()).optional(),
  subject_people: z.array(z.string()).optional(),
  subject_times: z.array(z.string()).optional(),
  authors: z.array(z.object({
    author: z.object({
      key: z.string(),
    }),
    type: z.object({
      key: z.string(),
    }),
  })).optional(),
  excerpts: z.array(z.object({
    text: z.string(),
    comment: z.string().optional(),
  })).optional(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
});

// Schema for Open Library author details
export const OpenLibraryAuthorSchema = z.object({
  name: z.string(),
  personal_name: z.string().optional(),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  bio: z.union([z.string(), z.object({ value: z.string() })]).optional(),
  photos: z.array(z.number()).optional(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
});

export type OpenLibrarySearchResult = z.infer<typeof OpenLibrarySearchSchema>;
export type OpenLibraryWork = z.infer<typeof OpenLibraryWorkSchema>;
export type OpenLibraryAuthor = z.infer<typeof OpenLibraryAuthorSchema>;

export class OpenLibraryService extends BaseHttpService {
  private static readonly BASE_URL = 'https://openlibrary.org';
  private static readonly COVERS_URL = 'https://covers.openlibrary.org/b';

  constructor() {
    super(OpenLibraryService.BASE_URL, {
      'User-Agent': 'Synapse-Education-Platform/1.0 (your-email@example.com)',
    });
  }

  /**
   * Search for books in Open Library
   * @param query Search query
   * @param page Page number (default: 1)
   * @param limit Number of results per page (default: 10, max: 100)
   */
  async searchBooks(
    query: string,
    page = 1,
    limit = 10
  ): Promise<OpenLibrarySearchResult> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: Math.min(limit, 100).toString(),
      fields: 'key,title,first_publish_year,author_name,author_key,isbn,cover_i,language,subject,has_fulltext',
    });

    return this.get<OpenLibrarySearchResult>(
      `/search.json?${params.toString()}`,
      {},
      OpenLibrarySearchSchema
    );
  }

  /**
   * Get book details by Open Library ID
   * @param workId Open Library work ID (e.g., 'OL123W')
   */
  async getBook(workId: string): Promise<OpenLibraryWork> {
    return this.get<OpenLibraryWork>(
      `/works/${workId}.json`,
      {},
      OpenLibraryWorkSchema
    );
  }

  /**
   * Get author details by Open Library ID
   * @param authorId Open Library author ID (e.g., 'OL123A')
   */
  async getAuthor(authorId: string): Promise<OpenLibraryAuthor> {
    return this.get<OpenLibraryAuthor>(
      `/authors/${authorId}.json`,
      {},
      OpenLibraryAuthorSchema
    );
  }

  /**
   * Get book cover image URL
   * @param coverId Cover ID from search results
   * @param size Image size (S, M, L) - default: M
   */
  getCoverImageUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    const sizes = {
      S: '-S',  // Small (thumbnail)
      M: '-M',  // Medium (cover)
      L: '-L',  // Large
    };
    
    return `${OpenLibraryService.CVRS_URL}/id/${coverId}${sizes[size]}.jpg?default=false`;
  }

  /**
   * Get book details by ISBN
   * @param isbn ISBN-10 or ISBN-13
   */
  async getBookByIsbn(isbn: string): Promise<OpenLibraryWork | null> {
    try {
      const response = await this.get<Record<string, any>>(
        `/isbn/${isbn}.json`,
        {},
        z.record(z.any())
      );
      
      // If the response has a works field, get the first work
      if (response.works && response.works.length > 0) {
        const workId = response.works[0].key.replace('/works/', '');
        return this.getBook(workId);
      }
      
      // Otherwise, return the response as a work
      return OpenLibraryWorkSchema.parse(response);
    } catch (error) {
      console.error('Error getting book by ISBN:', error);
      return null;
    }
  }

  /**
   * Get books by author
   * @param authorId Open Library author ID
   * @param limit Number of results (default: 10, max: 100)
   */
  async getBooksByAuthor(authorId: string, limit = 10): Promise<OpenLibrarySearchResult> {
    const params = new URLSearchParams({
      author: `OL${authorId}A`,
      limit: Math.min(limit, 100).toString(),
      fields: 'key,title,first_publish_year,author_name,author_key,isbn,cover_i,language,subject,has_fulltext',
    });

    return this.get<OpenLibrarySearchResult>(
      `/search.json?${params.toString()}`,
      {},
      OpenLibrarySearchSchema
    );
  }
}
