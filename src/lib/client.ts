import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as AxiosLogger from 'axios-logger';

export class ApiClient {
  protected client: AxiosInstance;

  constructor(public baseUrl: string) {
    const options = {
      baseURL: baseUrl
    };
    this.client = axios.create(options);
    // TODO let users define their own logger
    this.client.interceptors.request.use((request) => {
      return AxiosLogger.requestLogger(request, {
        headers: true,
      });
    });
    this.client.interceptors.response.use((response) => {
      return AxiosLogger.responseLogger(response, {
        headers: true,
      });
    });
  }
  // TODO(jayhelton) have a better client interface for data and error handling
  public get<T>(url: string, config: AxiosRequestConfig = {})
    : Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(url: string, body: any, config: AxiosRequestConfig = {})
    : Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, body, config);
  }

  public put<T>(url: string, config: AxiosRequestConfig = {})
    : Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, config);
  }

  public stream() { }
}
