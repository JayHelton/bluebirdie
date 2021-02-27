import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { Config } from '..';
import { StreamEventEmitter } from './stream-events';

/**
 * The generic APIClient used by BlueBirder.
 */
export class ApiClient {
  protected client: AxiosInstance;

  constructor(protected config: Config) {
    const options = {
      baseURL: this.config.baseUrl,
      // A nice abstraction so regular arrays can be provided for comma separated lists
      paramsSerializer(params: any) {
        const searchParams = new URLSearchParams();
        for (const key of Object.keys(params)) {
          const param = params[key];
          if (Array.isArray(param)) {
            searchParams.append(key, param.join(','));
          } else {
            searchParams.append(key, param);
          }
        }
        return searchParams.toString();
      },
    };

    this.client = axios.create(options);

    if (config.requestLogger) {
      this.client.interceptors.request.use(request => {
        return (
          (config.requestLogger && config.requestLogger(request)) || request
        );
      });
    }
    if (config.responseLogger) {
      this.client.interceptors.response.use(response => {
        return (
          (config.responseLogger && config.responseLogger(response)) || response
        );
      });
    }
  }

  // TODO(jayhelton) have a better client interface for error handling
  /**
   * A generic GET request.
   * @param url 
   * @param config 
   */
  public get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.client.get<T>(url, config).then(res => res.data);
  }

  /**
   * A generic POST request
   * @param url 
   * @param body 
   * @param config 
   */
  public post<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.client.post<T>(url, body, config).then(res => res.data);
  }

  /**
   * A POST request which stringifys the body.
   * This submits application/x-www-form-urlencoded content-type
   * @param url 
   * @param body 
   * @param config 
   */
  public postForm<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = qs.stringify(body);
    return this.client.post<T>(url, body, config).then(res => res.data);
  }

  /**
   * A generic PUT request
   * @param url 
   * @param body 
   * @param config 
   */
  public put<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return this.client.put<T>(url, body, config).then(res => res.data);
  }

  /**
   * A PUT request which stringifys the body.
   * This submits application/x-www-form-urlencoded content-type
   * @param url 
   * @param body 
   * @param config 
   */
  public putForm<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = qs.stringify(body);
    return this.client.put<T>(url, body, config).then(res => res.data);
  }

  /**
   * Creates an event emitter stream from a POST request.
   * This application/x-www-form-urlencoded content-type.
   * @param url 
   * @param body 
   * @param config 
   */
  public async postStream(
    url: string,
    body: any,
    config: AxiosRequestConfig = {}
  ): Promise<StreamEventEmitter> {
    const stream = await this.postForm(url, body, { ...config, responseType: 'stream' });
    return new StreamEventEmitter(stream);

  }

  /**
   * Creates an event emitter stream from a GET request.
   * This application/x-www-form-urlencoded content-type.
   * @param url 
   * @param config 
   */
  public async getStream(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<StreamEventEmitter> {
    const stream = await this.get(url, { ...config, responseType: 'stream' });
    return new StreamEventEmitter(stream);
  }
}
