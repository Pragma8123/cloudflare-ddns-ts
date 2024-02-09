import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalIpService } from './external-ip.service';

@Module({
  imports: [HttpModule],
  providers: [ExternalIpService],
  exports: [ExternalIpService],
})
export class ExternalIpModule {}
