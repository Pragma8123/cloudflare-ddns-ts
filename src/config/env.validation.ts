import { plainToInstance, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsFQDN,
  IsOptional,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

const API_TOKEN_REGEX = /^[a-zA-Z0-9-]{40}$/;

export class EnvironmentVariables {
  @IsString()
  @Matches(API_TOKEN_REGEX, {
    message: 'API_TOKEN must be a valid Cloudflare API token',
  })
  API_TOKEN: string;

  @IsFQDN()
  ZONE: string;

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  RECORDS: string;

  @IsBoolean()
  @IsOptional()
  PROXIED?: boolean;

  @IsString()
  @IsOptional()
  TZ?: string;

  @IsString()
  @IsOptional()
  CRON?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((error) =>
      error.toString(true, false, '', true),
    );
    throw new Error(errorMessages.join(''));
  }

  return validatedConfig;
}
