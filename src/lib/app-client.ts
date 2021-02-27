import { Config } from '..';
import { ApiClient } from './client';

/**
 * The ApiClient used for making API requests to Twitter on behalf of an application.
 * If a bearer token exists in the config, it is automatically added as an authorization header.
 */
export class AppClient extends ApiClient {
  constructor(public config: Config) {
    super(config);

    this.client.interceptors.request.use(request => {
      if (this.config.bearerToken) {
        request.headers.Authorization = `Bearer ${this.config.bearerToken}`;
      }
      return request;
    });
  }

  /**
   * Set a new bearer token
   * @param bearerToken 
   */
  public setBearerToken(bearerToken: string) {
    this.config.bearerToken = bearerToken;
  }

  /**
   * Request for a new bearer token.
   */
  public getBearerToken() {
    const { apiKey, apiSecretKey } = this.config;
    // Must encode the header before sending
    const encodedToken = Buffer.from(`${apiKey}:${apiSecretKey}`).toString(
      'base64'
    );
    const headers = {
      Authorization: `Basic ${encodedToken}`,
    };

    return this.post(
      '/oauth2/token',
      {
        grant_type: 'client_credentials',
      },
      {
        headers,
      }
    );
  }
}
