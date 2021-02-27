import { AppClient } from './lib/app-client';
import { UserClient } from './lib/user-client';

export interface BlueBirdieConfig {
  url?: string;
  apiKey: string;
  apiSecretKey: string;
  accessToken?: string;
  accessTokenSecret?: string;
  bearerToken?: string;
}

export class BlueBirdie {
  public user: UserClient;
  public app: AppClient;

  constructor(public config: BlueBirdieConfig) {
    // TODO make specific options
    this.user = new UserClient({ baseUrl: this.getUrl(), ...config });
    this.app = new AppClient({ baseUrl: this.getUrl(), ...config });
  }

  private getUrl(): string {
    return this.options.url || `https://api.twitter.com`;
  }
}
