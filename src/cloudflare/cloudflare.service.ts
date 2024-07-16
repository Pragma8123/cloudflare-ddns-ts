import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cloudflare from 'cloudflare';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private cf: Cloudflare;

  constructor(private readonly configService: ConfigService) {
    const apiToken = this.configService.get<string>('API_TOKEN');
    this.cf = new Cloudflare({ apiToken });
  }
}
