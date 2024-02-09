import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

class ExternalIpResponse {
  public ip: string;
}

@Injectable()
export class ExternalIpService {
  private readonly logger: Logger = new Logger(ExternalIpService.name);

  constructor(private readonly httpService: HttpService) {}

  async getExternalIp(): Promise<string> {
    const ipObservable = this.httpService
      .get<ExternalIpResponse>('http://api.ipify.org?format=json')
      .pipe(
        map((response) => response.data.ip),
        catchError((error) => {
          this.logger.debug(error);
          throw new Error('Failed to get external IP');
        }),
      );
    return await firstValueFrom(ipObservable);
  }
}
