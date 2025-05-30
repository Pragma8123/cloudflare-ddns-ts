import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { CloudflareService } from './cloudflare/cloudflare.service';
import { EnvironmentVariables } from './config/env.validation';
import { ExternalIpService } from './external-ip/external-ip.service';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(AppService.name);
  private cronJob: CronJob;
  private ZONE: string;
  private RECORDS: string[];
  private PROXIED: boolean;
  private TZ: string;
  private CRON: string;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly externalIpService: ExternalIpService,
    private readonly cloudflareService: CloudflareService,
  ) {
    this.ZONE = this.configService.get('ZONE');
    this.RECORDS = this.configService.get('RECORDS', ['@']);
    this.PROXIED = this.configService.get('PROXIED', false);
    this.CRON = this.configService.get('CRON', '@daily');
    this.TZ = this.configService.get(
      'TZ',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  }

  async onApplicationBootstrap() {
    const success = await this.cloudflareService.verifyToken();
    if (!success) {
      throw new Error('Cloudflare token is invalid');
    }
    this.logger.log('Cloudflare token is valid');

    this.cronJob = new CronJob(
      this.CRON,
      () => this.updateDynamicDns(),
      null,
      true,
    );
    this.logger.log(
      `DNS update job started [${this.ZONE}]: "${this.CRON}" (${this.TZ})`,
    );
  }

  onApplicationShutdown() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
  }

  async updateDynamicDns() {
    try {
      const ip = await this.externalIpService.getExternalIp();
      this.logger.log(`Got external IP: ${ip}`);

      const results = await Promise.allSettled(
        this.RECORDS.map((r) =>
          this.cloudflareService.updateARecord(this.ZONE, r, ip, this.PROXIED),
        ),
      );
      results.forEach((r) => {
        if (r.status === 'rejected') {
          this.logger.error(r.reason);
        }
      });

      this.logger.log(
        `Updated DNS records [${this.ZONE}]: ${this.RECORDS.join(',')} | (${ip}) [${
          this.PROXIED ? 'proxied' : 'unproxied'
        }]`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
