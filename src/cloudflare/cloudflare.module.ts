import { Module } from '@nestjs/common';
import { CloudflareProvider } from './cloudflare.provider';
import { CloudflareService } from './cloudflare.service';

@Module({
  providers: [CloudflareProvider, CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
