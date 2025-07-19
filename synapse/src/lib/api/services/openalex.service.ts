import { BaseApiService, ApiResponse } from './base-api.service';

export interface Author {
  id: string;
  display_name: string;
  orcid?: string;
}

export interface Work {
  id: string;
  doi?: string;
  title: string;
  display_name: string;
  publication_year: number;
  publication_date: string;
  type: string;
  cited_by_count: number;
  abstract_inverted_index?: Record<string, number[]>;
  authorships: Array<{
    author: Author;
    author_position: string;
    institutions: Array<{
      id: string;
      display_name: string;
      country_code: string;
      type: string;
    }>;
  }>;
  biblio: {
    volume?: string;
    issue?: string;
    first_page?: string;
    last_page?: string;
  };
  primary_location: {
    source: {
      id: string;
      display_name: string;
      host_organization_name?: string;
      is_oa: boolean;
      landing_page_url?: string;
      pdf_url?: string;
    };
  };
  open_access: {
    is_oa: boolean;
    oa_status: string;
    oa_url?: string;
  };
  concepts: Array<{
    id: string;
    wikidata: string;
    display_name: string;
    level: number;
    score: number;
  }>;
  related_works?: string[];
  referenced_works?: string[];
  counts_by_year?: Array<{
    year: number;
    works_count: number;
    cited_by_count: number;
  }>;
  citation_count: number;
  is_retracted: boolean;
  is_paratext: boolean;
  language: string;
  type_crossref: string;
  primary_topic?: {
    id: string;
    display_name: string;
  };
  topics: Array<{
    id: string;
    display_name: string;
    subfield: {
      id: string;
      display_name: string;
      field: {
        id: string;
        display_name: string;
      };
    };
  }>;
  mesh_terms?: Array<{
    descriptor_ui: string;
    descriptor_name: string;
    qualifiers?: Array<{
      qualifier_ui: string;
      qualifier_name: string;
    }>;
  }>;
  grants?: Array<{
    funder: string;
    funder_display_name: string;
    award_id?: string;
  }>;
  referenced_works_count: number;
  related_works_count: number;
  ngram_url: string;
  ngram_count: number;
  abstract: string;
  abstract_inverted_index_cleaned?: string;
}

export interface WorksResponse {
  results: Work[];
  meta: {
    count: number;
    db_response_time_ms: number;
    page: number;
    per_page: number;
  };
}

export interface SearchParams {
  query: string;
  page?: number;
  perPage?: number;
  sortBy?: 'relevance' | 'cited_by_count:desc' | 'publication_date:desc';
  filter?: Record<string, string>;
}

export class OpenAlexService extends BaseApiService {
  private readonly baseApiUrl = 'https://api.openalex.org';

  constructor() {
    super('https://api.openalex.org', {
      'User-Agent': 'Synapse-Platform/1.0 (https://github.com/yourusername/synapse-platform; mailto:your-email@example.com)',
    });
  }

  /**
   * Search for academic works
   * @param params Search parameters
   */
  async searchWorks(params: SearchParams): Promise<ApiResponse<WorksResponse>> {
    const {
      query,
      page = 1,
      perPage = 10,
      sortBy = 'relevance',
      filter = {},
    } = params;

    try {
      // Build the search URL
      const searchParams = new URLSearchParams({
        search: query,
        page: page.toString(),
        per_page: perPage.toString(),
        sort: sortBy,
      });

      // Add filters if provided
      Object.entries(filter).forEach(([key, value]) => {
        searchParams.append(`filter.${key}`, value);
      });

      const response = await this.get<WorksResponse>(`/works?${searchParams.toString()}`);
      
      // Process the response to clean up the abstract if it's in inverted index format
      if (response.data?.results) {
        response.data.results = response.data.results.map(work => ({
          ...work,
          abstract: this.extractAbstract(work.abstract_inverted_index) || work.abstract || '',
          abstract_inverted_index_cleaned: this.extractAbstract(work.abstract_inverted_index)
        }));
      }
      
      return response;
    } catch (error) {
      console.error('Error searching works:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search works',
      };
    }
  }

  /**
   * Get a specific work by its OpenAlex ID, DOI, or other supported ID
   * @param id Work ID (OpenAlex ID, DOI, etc.)
   */
  async getWork(id: string): Promise<ApiResponse<Work>> {
    try {
      // Remove any URL prefix if present
      const cleanId = id.replace(/^https?:\/\/openalex\.org\//, '');
      const response = await this.get<Work>(`/works/${cleanId}`);
      
      // Process the response to clean up the abstract if it's in inverted index format
      if (response.data) {
        response.data.abstract = this.extractAbstract(response.data.abstract_inverted_index) || response.data.abstract || '';
        response.data.abstract_inverted_index_cleaned = this.extractAbstract(response.data.abstract_inverted_index);
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching work ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to fetch work ${id}`,
      };
    }
  }

  /**
   * Get related works for a given work
   * @param workId Work ID (OpenAlex ID, DOI, etc.)
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   */
  async getRelatedWorks(
    workId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<ApiResponse<WorksResponse>> {
    try {
      // Remove any URL prefix if present
      const cleanId = workId.replace(/^https?:\/\/openalex\.org\//, '');
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      const response = await this.get<WorksResponse>(
        `/works/${cleanId}/related_works?${params.toString()}`
      );
      
      // Process the response to clean up the abstract if it's in inverted index format
      if (response.data?.results) {
        response.data.results = response.data.results.map(work => ({
          ...work,
          abstract: this.extractAbstract(work.abstract_inverted_index) || work.abstract || '',
          abstract_inverted_index_cleaned: this.extractAbstract(work.abstract_inverted_index)
        }));
      }
      
      return response;
    } catch (error) {
      console.error(`Error fetching related works for ${workId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to fetch related works for ${workId}`,
      };
    }
  }

  /**
   * Helper method to extract plain text from inverted index abstract format
   * @param invertedIndex Inverted index object from OpenAlex
   * @returns Plain text abstract or undefined if not available
   */
  private extractAbstract(invertedIndex?: Record<string, number[]>): string | undefined {
    if (!invertedIndex) return undefined;
    
    try {
      // Convert the inverted index to an array of [word, positions] pairs
      const wordPositions = Object.entries(invertedIndex);
      
      // Flatten the positions and sort them
      const allPositions = wordPositions.flatMap(([word, positions]) => 
        positions.map(pos => ({ word, pos }))
      ).sort((a, b) => a.pos - b.pos);
      
      // Reconstruct the abstract text
      let abstract = '';
      let lastPos = -1;
      
      for (const { word, pos } of allPositions) {
        // Add space if there's a gap in positions
        if (lastPos !== -1 && pos > lastPos + 1) {
          abstract += ' ';
        }
        abstract += word;
        lastPos = pos;
      }
      
      return abstract;
    } catch (error) {
      console.error('Error extracting abstract:', error);
      return undefined;
    }
  }
}
