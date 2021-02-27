import { ApiClient } from './client';

export class AppClient extends ApiClient {
  // TODO(jayhelton) create options interface
  constructor(public config: any) {
    super(config.baseUrl);
  }

  public setBearerToken(bearerToken: string) {
    this.config.bearerToken = bearerToken;
    this.client.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${this.config.bearerToken}`;
      return config;
    });
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
    }).then(res => res.data);
  }
}
