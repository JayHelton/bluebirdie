import crypto from 'crypto';
import OAuth, { RequestOptions } from 'oauth-1.0a';
import qs from 'qs';

import { ApiClient } from './client';

export class UserClient extends ApiClient {
  private oAuthClient: OAuth;

  // TODO(jayhelton) create options interface
  constructor(public config: any) {
    super(config.baseUrl);
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
            params.url = `${params.url}?${request?.paramsSerializer && request?.paramsSerializer(request.params)}`;
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

  public async getRequestToken(callbackUrl: string) {
    const params = { oauth_callback: callbackUrl };
    const url = `${this.baseUrl}/oauth/request_token?${qs.stringify(params)}`;
    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );
    return this.post<string>(url, null, { headers });
  }

  public setAccessToken(accessToken: string) {
    this.config.accessToken = accessToken;
  }

  public async getAccessToken({
    oauthVerifier,
    oauthToken,
  }: {
    [k: string]: string;
  }) {
    const params = { oauth_verifier: oauthVerifier, oauth_token: oauthToken };
    const url = `${this.baseUrl}/oauth/access_token?${qs.stringify(params)}`;

    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );

    return this.post(url, null, { headers });
  }
}
