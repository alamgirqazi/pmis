import { environment } from '../environments/environment';

export class Baseconfig {
  // private static path = 'http://115.186.156.98:3000';
  private static path = 'https://pmis-backend-now-v-hvvahhcexf.now.sh';
  // private static path = 'http://localhost:3000';
  private static api_version = '1';
  public static getPath(): string {
    return Baseconfig.path;
  }
  public static getEnvPath(): string {
    return environment.apiBase + '/' + Baseconfig.api_version;
  }
}
