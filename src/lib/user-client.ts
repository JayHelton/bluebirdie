import crypto from 'crypto';
import OAuth, { RequestOptions } from 'oauth-1.0a';
import qs from 'qs';
import { Config } from '..';

import { ApiClient } from './client';

/**
 * The ApiClient used for making API requests to Twitter on behalf of a user.
 * If an access token and access token secret are configured, this client will
 * automatically signed each request using the OAuth1.0a protocol.
 */
export class UserClient extends ApiClient {
  private oAuthClient: OAuth;

  constructor(public config: Config) {
    super(config);
    this.oAuthClient = new OAuth({
      consumer: { key: config.apiKey, secret: config.apiSecretKey },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      },
    });

    this.client.interceptors.request.use(request => {
      if (this.config.accessToken && this.config.accessTokenSecret) {
        const params: RequestOptions = {
          url: request.baseURL! + request.url!,
          method: request.method?.toUpperCase()!,
        };

        switch (params.method) {
          case 'GET': {
            params.url = `${params.url}?${request?.paramsSerializer &&
              request?.paramsSerializer(request.params)}`;
            break;
          }
          default: {
            params.data = qs.parse(request.data);
            break;
          }
        }

        const headers = this.oAuthClient.toHeader(
          this.oAuthClient.authorize(params, {
            key: this.config.accessToken,
            secret: this.config.accessTokenSecret,
          })
        );
        request.headers['Authorization'] = headers.Authorization;
      }
      return request;
    });
  }

  /**
   * Start the OAuth ceremony.
   * This will return a request token which will be used to send a user
   * to Twitters authorization server.
   * @param callbackUrl
   */
  public async getRequestToken(callbackUrl: string) {
    const params = { oauth_callback: callbackUrl };
    const url = `${this.config.baseUrl}/oauth/request_token?${qs.stringify(
      params
    )}`;
    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );
    return this.post<string>(url, null, { headers });
  }

  /**
   * Request an access token and access token secret.
   * This is done after retrieing an OAuth token and verifier
   * from Twitters authorization server
   * @param options.oauthVerifier
   * @param options.oauthToken
   */
  public async getAccessToken({
    oauthVerifier,
    oauthToken,
  }: {
    [k: string]: string;
  }) {
    const params = { oauth_verifier: oauthVerifier, oauth_token: oauthToken };
    const url = `${this.config.baseUrl}/oauth/access_token?${qs.stringify(
      params
    )}`;

    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );

    return this.post(url, null, { headers });
  }

  /**
   * Set a new accessToken on the configuration
   * @param accessToken
   */
  public setAccessToken(accessToken: string) {
    this.config.accessToken = accessToken;
  }

  /**
   * Set a new accessTokenSecret on the configuration
   * @param accessTokenSecret
   */
  public setAccessTokenSecret(accessTokenSecret: string) {
    this.config.accessTokenSecret = accessTokenSecret;
  }
}
