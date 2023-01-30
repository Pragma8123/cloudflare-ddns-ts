import { Injectable, Logger } from '@nestjs/common';
import {
  CloudflareProvider,
  ListDnsRecordsResponse,
} from './cloudflare.provider';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);

  constructor(private readonly cloudflareProvider: CloudflareProvider) {}

  async verifyToken(): Promise<boolean> {
    const { success } = await this.cloudflareProvider.verifyToken();
    return success;
  }

  async updateDnsRecords(
    zone: string,
    recordNames: string[],
    ip: string,
    proxied: boolean,
  ) {
    const zoneId = await this.getZoneId(zone);
    const recordIds = await this.getRecordIds(zoneId, recordNames);
    return await Promise.all(
      recordIds.map((recordId) =>
        this.updateDnsRecord(zoneId, recordId, ip, proxied),
      ),
    );
  }

  private async getZoneId(zone: string): Promise<string> {
    const { result } = await this.cloudflareProvider.listZones();
    const zoneResult = result.find((zoneResult) => zoneResult.name === zone);
    return zoneResult.id;
  }

  private async getRecordIds(
    zoneId: string,
    recordNames: string[],
  ): Promise<string[]> {
    const { result } = await this.cloudflareProvider.listDnsRecords(zoneId);
    const recordResults = this.filterRecords(result, recordNames);
    return recordResults.map((recordResult) => recordResult.id);
  }

  private async updateDnsRecord(
    zoneId: string,
    recordId: string,
    ip: string,
    proxied: boolean,
  ) {
    return await this.cloudflareProvider.patchDnsRecord(
      zoneId,
      recordId,
      ip,
      proxied,
    );
  }

  private filterRecords(
    records: ListDnsRecordsResponse['result'],
    recordNames: string[],
  ) {
    return records.filter((record) => {
      return (
        (recordNames.includes(record.name.split('.')[0]) ||
          (record.name === record.zone_name && recordNames.includes('@'))) &&
        record.type === 'A'
      );
    });
  }
}
