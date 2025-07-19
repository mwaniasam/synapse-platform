import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export abstract class BaseApiService {
  protected readonly http: AxiosInstance;
  protected readonly baseUrl: string;
  protected readonly defaultHeaders: Record<string, string>;

  constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {}
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders
    };

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: this.defaultHeaders,
      timeout: 10000 // 10 seconds
    });

    // Add request interceptor for logging
    this.http.interceptors.request.use(
      (config) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );
  }

  protected async get<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.get<T>(endpoint, config);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  protected async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.http.post<T>(endpoint, data, config);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      return this.handleError<T>(error);
    }
  }

  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  }

  private handleError<T>(error: any): ApiResponse<T> {
    console.error('API Error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        success: false,
        error: error.response.data?.message || error.message,
        status: error.response.status
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        error: 'No response received from the server',
        status: 0
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        success: false,
        error: error.message,
        status: 0
      };
    }
  }
}
