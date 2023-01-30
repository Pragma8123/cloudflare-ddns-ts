import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { from } from 'rxjs';
import { ExternalIpProvider } from './external-ip.provider';

describe('ExternalIpProvider', () => {
  let service: ExternalIpProvider;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExternalIpProvider],
    })
      .overrideProvider(HttpService)
      .useValue({
        get: jest.fn(),
      })
      .compile();

    service = module.get<ExternalIpProvider>(ExternalIpProvider);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExternalIp', () => {
    it('should return a GetExternalIpResponse object', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => {
        return from(
          Promise.resolve({
            data: {
              ip: '127.0.0.1',
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
          }),
        );
      });

      const result = await service.getExternalIp();

      expect(result).toHaveProperty('ip');
    });

    it('should call httpService.get() once with the correct URL and params', async () => {
      const mockedGet = jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => {
          return from(
            Promise.resolve({
              data: {
                ip: '127.0.0.1',
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {},
            }),
          );
        });

      await service.getExternalIp();

      expect(mockedGet).toBeCalledTimes(1);
      expect(mockedGet).toBeCalledWith('/', { params: { format: 'json' } });
    });
  });
});
