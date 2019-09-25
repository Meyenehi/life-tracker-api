import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv-extended';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(path?: string) {
    this.envConfig = dotenv.load({
      ...(path && { path }),
      errorOnMissing: true,
    });
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
