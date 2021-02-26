import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import qs from 'qs';

import { ApiClient } from './client';

export class UserClient extends ApiClient {
  private oAuthClient: OAuth;
  // TODO(jayhelton) create options interface
  constructor(public options: any) {
    super(options.baseUrl);
    this.oAuthClient = new OAuth({
      consumer: { key: options.apiKey, secret: options.apiSecretKey },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      },
    });
  }

  public async getRequestToken(callbackUrl: string) {
    const url = `${this.baseUrl}/request_token?oauth_callback=${callbackUrl}`;
    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );
    return this.post(url, null, { headers });
  }

  public setAccessToken(accessToken: string) {
    this.options.accessToken = accessToken;
    this.client.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${this.options.accessToken}`;
      return config;
    });
  }

  public getAccessToken({
    oauthVerifier,
    oauthToken,
  }: {
    [k: string]: string;
  }) {
    const params = { oauth_verifier: oauthVerifier, oauth_token: oauthToken };
    const url = `${this.baseUrl}/access_token?${qs.stringify(params)}`;

    const headers = this.oAuthClient.toHeader(
      this.oAuthClient.authorize({
        url,
        method: 'POST',
      })
    );

    return this.client.post(url, null, { headers }).then(res => res.data);
  }
}
