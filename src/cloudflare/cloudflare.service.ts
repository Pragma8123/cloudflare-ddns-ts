import { Injectable, Logger } from '@nestjs/common';
import { CloudflareProvider } from './cloudflare.provider';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);

  constructor(private readonly cloudflareProvider: CloudflareProvider) {}
}
