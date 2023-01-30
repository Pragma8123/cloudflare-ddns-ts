import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export type VerifyTokenResponse = {
  errors: { code: number; message: string }[];
  result: {
    id: string;
    status: string;
  };
  success: boolean;
};

export type PatchDnsRecordResponse = {
  errors: { code: number; message: string }[];
  messages: { code: number; message: string }[];
  success: boolean;
};

export type ListZonesResponse = {
  errors: { code: number; message: string }[];
  result: {
    id: string;
    name: string;
  }[];
  success: boolean;
};

export type ListDnsRecordsResponse = {
  errors: { code: number; message: string }[];
  result: {
    id: string;
    name: string;
    content: string;
    type: string;
    zone_name: string;
  }[];
  success: boolean;
};

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
