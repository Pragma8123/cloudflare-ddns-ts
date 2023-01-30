import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalIpProvider } from './external-ip.provider';
import { ExternalIpService } from './external-ip.service';

@Module({
  imports: [HttpModule.register({ baseURL: 'https://api.ipify.org' })],
  providers: [ExternalIpProvider, ExternalIpService],
  exports: [ExternalIpService],
})
export class ExternalIpModule {}
