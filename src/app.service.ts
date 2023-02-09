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
  private API_TOKEN: string;
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
    this.API_TOKEN = this.configService.get('API_TOKEN');
    this.ZONE = this.configService.get('ZONE');
    this.RECORDS = this.configService.get('RECORDS', ['@']);
    this.PROXIED = this.configService.get('PROXIED', false);
    this.TZ = this.configService.get('TZ', 'UTC');
    this.CRON = this.configService.get('CRON', '@daily');
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
      this.TZ,
    );
    this.logger.log(`DNS update job started: "${this.CRON}" (${this.TZ})`);
  }

  onApplicationShutdown() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
  }

  async updateDynamicDns() {
    try {
      const ip = await this.externalIpService.getExternalIp();

      await this.cloudflareService.updateDnsRecords(
        this.ZONE,
        this.RECORDS,
        ip,
        this.PROXIED,
      );

      this.logger.log(
        `Updated DNS records: ${this.RECORDS.join(', ')} | (${ip}) [${
          this.PROXIED ? 'proxied' : 'unproxied'
        }]`,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
