import { Injectable } from '@nestjs/common';
import { ExternalIpProvider } from './external-ip.provider';

@Injectable()
export class ExternalIpService {
  constructor(private readonly externalIpProvider: ExternalIpProvider) {}

  async getExternalIp(): Promise<string> {
    const { ip } = await this.externalIpProvider.getExternalIp();
    return ip;
  }
}
