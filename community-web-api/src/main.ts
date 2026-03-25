import sdk from './tracing';

// Must be the first import
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ICommonConfig } from './config/interfaces';
import { OtelLogger } from './otel-logger';
import { configureOpenApi } from './swagger';

async function bootstrap() {
  // Start the OpenTelemetry SDK
  sdk.start();

  const logger = new OtelLogger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = await app.resolve<ConfigService>(ConfigService);
  const config = configService.getOrThrow<ICommonConfig>('common');

  app.useLogger(app.get(OtelLogger)); // Use the OTEL logger
  configureOpenApi(app);

  await app.listen(config.port);
  logger.log(`Application is running on: http://localhost:${config.port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
