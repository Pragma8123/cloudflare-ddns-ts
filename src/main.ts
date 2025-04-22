import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, LogLevel } from '@nestjs/common';

function getLogLevelsFromEnv(): LogLevel[] {
  const raw = process.env.LOG_LEVEL || 'log,error,warn';
  return raw.split(',').map((level) => level.trim()) as LogLevel[];
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'cloudflare-ddns',
      logLevels: getLogLevelsFromEnv(),
    }),
  });
  app.enableShutdownHooks(['SIGINT', 'SIGTERM']);
}

bootstrap();
