import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Cloudflare from 'cloudflare';
import { EnvironmentVariables } from 'src/config/env.validation';

interface VerifyTokenResponse {
  success: boolean;
}

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
  private cf: Cloudflare;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.cf = new Cloudflare({
      apiToken: configService.get<string>('API_TOKEN'),
    });
  }

  async verifyToken(): Promise<boolean> {
    try {
      const response = await this.cf.request<any, VerifyTokenResponse>({
        method: 'get',
        path: '/user/tokens/verify',
      });
      return response.success;
    } catch (error) {
      this.logger.error('Could not validate API Token', error);
      return false;
    }
  }

  async updateARecord(
    zoneName: string,
    recordName: string,
    ip: string,
    proxied: boolean = false,
  ): Promise<void> {
    try {
      const zoneId = await this.getZoneId(zoneName);
      const fqdn = recordName === '@' ? zoneName : `${recordName}.${zoneName}`;

      const { result } = await this.cf.dns.records.list({
        zone_id: zoneId,
        name: { exact: fqdn },
      });

      if (!result[0]) {
        this.logger.debug(`creating new record: ${fqdn}`);
        await this.cf.dns.records.create({
          zone_id: zoneId,
          type: 'A',
          name: fqdn,
          content: ip,
          proxied,
        });
      } else {
        this.logger.debug(`updating existing record: ${fqdn}`);
        const recordId = result[0].id;
        await this.cf.dns.records.edit(recordId, {
          zone_id: zoneId,
          content: ip,
          proxied,
        });
      }
    } catch (error) {
      this.logger.error('Error updating DNS record:', error.message);
    }
  }

  private async getZoneId(name: string): Promise<string> {
    const { result } = await this.cf.zones.list({ name });
    if (!result[0]) {
      throw new Error(`Zone "${name}" not found`);
    }
    return result[0].id;
  }
}
