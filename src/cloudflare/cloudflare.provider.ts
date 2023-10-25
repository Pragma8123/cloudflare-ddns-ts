import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { firstValueFrom } from 'rxjs';

export class CloudflareError {
  public code: number;
  public message: string;
}

export class VerifyTokenResult {
  public id: string;
  public status: string;
}

export class VerifyTokenResponse {
  public errors: CloudflareError[];
  public result: VerifyTokenResult;
  public success: boolean;
}

export class PatchDnsRecordMessage {
  public code: number;
  public message: string;
}

export class PatchDnsRecordResponse {
  public errors: CloudflareError[];
  public messages: PatchDnsRecordMessage[];
  public success: boolean;
}

export class Zone {
  public id: string;
  public name: string;
}

export class ListZonesResponse {
  public errors: CloudflareError[];
  public result: Zone[];
  public success: boolean;
}

export class DnsRecord {
  public id: string;
  public name: string;
  public content: string;
  public type: string;

  @Expose({ name: 'zone_name' })
  public zoneName: string;
}

export class ListDnsRecordsResponse {
  public errors: CloudflareError[];
  public result: DnsRecord[];
  public success: boolean;
}

@Injectable()
export class CloudflareProvider {
  private readonly logger = new Logger(CloudflareProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async verifyToken(): Promise<VerifyTokenResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<VerifyTokenResponse>('/user/tokens/verify'),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async patchDnsRecord(
    zoneId: string,
    recordId: string,
    ip: string,
    proxied: boolean,
  ): Promise<PatchDnsRecordResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch<PatchDnsRecordResponse>(
          `/zones/${zoneId}/dns_records/${recordId}`,
          {
            content: ip,
            proxied,
          },
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async listZones(): Promise<ListZonesResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ListZonesResponse>('/zones'),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  async listDnsRecords(zoneId: string): Promise<ListDnsRecordsResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ListDnsRecordsResponse>(
          `/zones/${zoneId}/dns_records`,
        ),
      );
      return data;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }
}
