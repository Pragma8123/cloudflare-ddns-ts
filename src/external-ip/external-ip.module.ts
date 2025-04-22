import { Module } from '@nestjs/common';
import { ExternalIpService } from './external-ip.service';

@Module({
  providers: [ExternalIpService],
  exports: [ExternalIpService],
})
export class ExternalIpModule {}
