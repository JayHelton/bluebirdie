import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppClient } from './lib/app-client';
import { UserClient } from './lib/user-client';

export interface Config {
  baseUrl?: string;
  apiKey: string;
  apiSecretKey: string;
  accessToken?: string;
  accessTokenSecret?: string;
  bearerToken?: string;
  requestLogger?: (request: AxiosRequestConfig) => AxiosRequestConfig;
  responseLogger?: (response: AxiosResponse) => AxiosResponse;
}

export class BlueBirdie {
  public user: UserClient;
  public app: AppClient;

  constructor(public config: Config) {
    this.user = new UserClient({ ...config, baseUrl: this.getUrl() });
    this.app = new AppClient({ ...config, baseUrl: this.getUrl() });
  }

  private getUrl(): string {
    return this.config.baseUrl || `https://api.twitter.com`;
  }
}
