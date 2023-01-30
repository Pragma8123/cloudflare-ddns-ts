import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { ExternalIpModule } from './external-ip/external-ip.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    CloudflareModule,
    ExternalIpModule,
  ],
  providers: [AppService],
})
export class AppModule {}
