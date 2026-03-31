/**
 * HTTP 클라이언트 공통 모듈
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from "axios";

export interface HttpClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
      timeout: config.timeout || 30000
    });
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      throw error;
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      console.error(`HTTP Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.message);
    } else {
      console.error("Request error:", error.message);
    }
  }
}

/**
 * API-Football 클라이언트 생성
 */
export function createApiFootballClient(): HttpClient {
  const apiKey = process.env.API_SPORTS_KEY || "ee5eb956fb3e410df048f3f6a73a30e7";

  return new HttpClient({
    baseURL: "https://v3.football.api-sports.io",
    headers: {
      "x-apisports-key": apiKey
    },
    timeout: 30000
  });
}

/**
 * PandaScore 클라이언트 생성
 */
export function createPandaScoreClient(): HttpClient {
  const apiKey =
    process.env.PANDASCORE_API_KEY || "-GBm5bFNYgi3202Zbvmk6s2mO34r2YRdoapFnJzNUXkRKaRRNiY";

  return new HttpClient({
    baseURL: "https://api.pandascore.co",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    timeout: 30000
  });
}
