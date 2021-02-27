import { ApiClient } from './client';

export class AppClient extends ApiClient {
  // TODO(jayhelton) create options interface
  constructor(public config: any) {
    super(config.baseUrl);

    this.client.interceptors.request.use(request => {
      if (this.config.bearerToken) {
        request.headers.Authorization = `Bearer ${this.config.bearerToken}`;
      }
      return request;
    });
  }

  public setBearerToken(bearerToken: string) {
    this.config.bearerToken = bearerToken;
  }

  public getBearerToken() {
    const { apiKey, apiSecretKey } = this.config;
    // Must encode the header before sending
    const encodedToken = Buffer.from(`${apiKey}:${apiSecretKey}`).toString(
      'base64'
    );
    const headers = {
      Authorization: `Basic ${encodedToken}`,
    };

    return this.post('/oauth2/token', {
      grant_type: 'client_credentials',
    }, {
      headers,
    });
  }
}
