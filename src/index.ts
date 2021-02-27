import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppClient } from './lib/app-client';
import { UserClient } from './lib/user-client';

/**
 * Configuration interface for BlueBirdie.
 */
export interface Config {
  /**
   * Optionally override the baseUrl.
   * Oterwhise, https://api.twitter.com is used.
   */
  baseUrl?: string;
  /**
   * Your registered applications api key
   */
  apiKey: string;
  /**
   * Your registered applications api secret
   */
  apiSecretKey: string;
  /**
   * The OAuth access token for a user
   */
  accessToken?: string;
  /**
   * The OAuth access token secret used for authenticating requests
   */
  accessTokenSecret?: string;
  /**
   * Bearer token used to authenticate an application
   */
  bearerToken?: string;
  /**
   * A request logger function that will run on each request
   */
  requestLogger?: (request: AxiosRequestConfig) => AxiosRequestConfig;
  /**
   * A response logger function that will run on each respose
   */
  responseLogger?: (response: AxiosResponse) => AxiosResponse;
}

/**
 * The entrypoint for the BlueBirdie interface over the twitter API.
 * This class exposes the UserClient and the AppClient, which are handled differently
 * during authentication.
 */
export class BlueBirdie {
  /**
   * The class instance used to interact with Twitter on behalf of a user.
   * Typically used for read/write operations.
   */
  public user: UserClient;
  /**
   * The class instance used to interact with twitter on behalf of an application.
   * Typically read only.
   */
  public app: AppClient;

  /**
   * Create a new instance of BlueBirdie
   * @param config
   */
  constructor(public config: Config) {
    this.user = new UserClient({ ...config, baseUrl: this.getUrl() });
    this.app = new AppClient({ ...config, baseUrl: this.getUrl() });
  }

  private getUrl(): string {
    return this.config.baseUrl || `https://api.twitter.com`;
  }
}

export {
  AppClient,
  UserClient,
};
