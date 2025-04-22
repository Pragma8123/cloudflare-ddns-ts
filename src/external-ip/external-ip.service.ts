import { Injectable } from '@nestjs/common';
import { publicIpv4 } from 'public-ip';

@Injectable()
export class ExternalIpService {
  constructor() {}

  async getExternalIp(): Promise<string> {
    return await publicIpv4();
  }
}
