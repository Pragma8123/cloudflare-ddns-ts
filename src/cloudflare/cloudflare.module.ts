import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudflareProvider } from './cloudflare.provider';
import { CloudflareService } from './cloudflare.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        headers: {
          Authorization: `Bearer ${configService.get('API_TOKEN')}`,
          'Content-Type': 'application/json',
        },
        baseURL: 'https://api.cloudflare.com/client/v4',
        timeout: 10000,
      }),
    }),
  ],
  providers: [CloudflareProvider, CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
