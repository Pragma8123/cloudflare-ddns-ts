import { plainToInstance, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsFQDN,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  API_TOKEN: string;

  @IsFQDN()
  ZONE: string;

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  RECORDS: string;

  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsBoolean()
  @IsOptional()
  PROXIED?: boolean;

  @IsString()
  @IsOptional()
  CRON?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config);

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
