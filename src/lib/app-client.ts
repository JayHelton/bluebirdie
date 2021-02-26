import qs from 'qs';
import { ApiClient } from './client';

export class AppClient extends ApiClient {
  // TODO(jayhelton) create options interface
  constructor(public options: any) {
    super(options.baseUrl);
  }

  public setBearerToken(bearerToken: string) {
    this.options.bearerToken = bearerToken;
    this.client.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${this.options.bearerToken}`;
      return config;
    });
  }

  public getBearerToken() {
    const { apiKey, apiSecretKey } = this.options;
    // Must encode the header before sending
    const encodedToken = Buffer.from(`${apiKey}:${apiSecretKey}`).toString(
      'base64'
    );
    const headers = {
      Authorization: `Basic ${encodedToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Must stringify the body data so its url encoded format
    const body = qs.stringify({
      grant_type: 'client_credentials',
    });

    return this.post('/oauth2/token', body, {
      headers,
    }).then(res => res.data);
  }
}
