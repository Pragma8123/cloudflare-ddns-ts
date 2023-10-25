import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export class GetExternalIpResponse {
  public ip: string;
}

@Injectable()
export class ExternalIpProvider {
  constructor(private readonly httpService: HttpService) {}

  async getExternalIp(): Promise<GetExternalIpResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<GetExternalIpResponse>('/', {
        params: { format: 'json' },
      }),
    );
    return data;
  }
}
