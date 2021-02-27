import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
//import * as AxiosLogger from 'axios-logger';
import qs from 'qs';
import { Observable } from 'rxjs';

export class ApiClient {
  protected client: AxiosInstance;

  constructor(public baseUrl: string) {
    const options = {
      baseURL: baseUrl,
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
      }
    };

    this.client = axios.create(options);

    // TODO let users define their own logger
    // this.client.interceptors.request.use(request => {
    //   return AxiosLogger.requestLogger(request, {
    //     headers: true,
    //   });
    // });
    // this.client.interceptors.response.use(response => {
    //   return AxiosLogger.responseLogger(response, {
    //     headers: true,
    //   });
    // });
  }

  // private parseV1Buffer(buffer: Bugge, onParse, onError) {
  //   buffer += buffer.toString('utf8');
  //   let index;
  //   let json;

  //   while ((index = buffer.indexOf(END)) > -1) {
  //     json = buffer.slice(0, index);
  //     buffer = buffer.slice(index + END_LENGTH);
  //     if (json.length > 0) {
  //       try {
  //         json = JSON.parse(json);
  //         onParse(json);
  //       } catch (error) {
  //         error.source = json;
  //         onError(error);
  //       }
  //     }
  //   }
  // }

  // TODO(jayhelton) have a better client interface for data and error handling
  public get<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return this.client.get<T>(url, config)
      .then(res => res.data);
  }

  public post<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return this.client.post<T>(url, body, config)
      .then(res => res.data);
  }

  public postForm<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = qs.stringify(body);
    return this.client.post<T>(url, body, config)
      .then(res => res.data);
  }

  public put<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    return this.client.put<T>(url, body, config)
      .then(res => res.data);
  }

  public putForm<T>(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = qs.stringify(body);
    return this.client.put<T>(url, body, config)
      .then(res => res.data);
  }

  public postStream(
    url: string,
    body: any,
    config: AxiosRequestConfig = {},
  ): Observable<any> {
    const observable = new Observable(subscriber => {
      this.postForm(url, body, { ...config, responseType: 'stream' })
        .then((stream: any) => {
          stream.on('data', (data: string) => {
            try {
              const json = JSON.parse(data);
              subscriber.next(json);
            } catch (e) { }
          }).on('error', (error: { code: string; }) => {
            subscriber.error(error);
            subscriber.complete();
          });
        }).catch(error => {
          subscriber.error(error);
          subscriber.complete();
        });
    });
    return observable;
  }

  public getStream(
    url: string,
    config: AxiosRequestConfig = {},
  ): Observable<any> {
    const observable = new Observable(subscriber => {
      this.get(url, { ...config, responseType: 'stream' })
        .then((stream: any) => {
          stream.on('data', (data: string) => {
            try {
              const json = JSON.parse(data);
              subscriber.next(json);
            } catch (e) { }
          }).on('error', (error: { code: string; }) => {
            subscriber.error(error);
          });
        }).catch(subscriber.error);
    });
    return observable;
  }
}
