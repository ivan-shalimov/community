// tracing Must be the first import
import sdk from './tracing';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { NativeLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { ICommonConfig } from './config/interfaces';
import { configureOpenApi } from './swagger';

async function bootstrap() {
  // Start the OpenTelemetry SDK
  sdk.start();

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = await app.resolve<ConfigService>(ConfigService);
  const config = configService.getOrThrow<ICommonConfig>('common');

  app.useLogger(app.get(NativeLogger));
  if (process.env.NODE_ENV !== 'production') {
    configureOpenApi(app);
  }

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(config.port);
  logger.log(`Application is running on: http://localhost:${config.port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
