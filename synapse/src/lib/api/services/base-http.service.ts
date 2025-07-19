import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { z } from 'zod';

export class BaseHttpService {
  protected client: AxiosInstance;
  protected baseURL: string;
  protected defaultHeaders: Record<string, string>;
  protected rateLimit: number;
  protected rateLimitRemaining: number;
  protected rateLimitReset: number;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders
    };
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: this.defaultHeaders,
      timeout: 10000, // 10 seconds
    });

    // Initialize rate limiting
    this.rateLimit = 100; // Default rate limit
    this.rateLimitRemaining = 100;
    this.rateLimitReset = Date.now() + 60000; // 1 minute from now

    // Add response interceptor to handle rate limiting
    this.client.interceptors.response.use(
      (response) => {
        this.updateRateLimits(response.headers);
        return response;
      },
      (error) => {
        if (error.response) {
          this.updateRateLimits(error.response.headers);
        }
        return Promise.reject(error);
      }
    );
  }

  private updateRateLimits(headers: any) {
    if (headers['x-ratelimit-limit']) {
      this.rateLimit = parseInt(headers['x-ratelimit-limit'], 10);
    }
    if (headers['x-ratelimit-remaining']) {
      this.rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'], 10);
    }
    if (headers['x-ratelimit-reset']) {
      this.rateLimitReset = parseInt(headers['x-ratelimit-reset'], 10) * 1000;
    }
  }

  protected async request<T>(config: AxiosRequestConfig, schema?: z.ZodType<T>): Promise<T> {
    try {
      const response = await this.client({
        ...config,
        headers: {
          ...this.defaultHeaders,
          ...config.headers,
        },
      });

      if (schema) {
        return schema.parse(response.data);
      }
      return response.data as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`API Error: ${error.message}`, {
          url: config.url,
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  }

  protected async get<T>(url: string, config: AxiosRequestConfig = {}, schema?: z.ZodType<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url }, schema);
  }

  protected async post<T>(
    url: string,
    data?: any,
    config: AxiosRequestConfig = {},
    schema?: z.ZodType<T>
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data }, schema);
  }
}
