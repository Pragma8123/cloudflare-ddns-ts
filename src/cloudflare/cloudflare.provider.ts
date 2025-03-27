import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cloudflare from 'cloudflare';

@Injectable()
export class CloudflareProvider {
  private readonly logger = new Logger(CloudflareProvider.name);
  private client: Cloudflare;

  constructor(private readonly configService: ConfigService) {
    const apiToken = configService.get<string>('API_TOKEN');

    this.client = new Cloudflare({
      apiToken,
    });
  }
}
