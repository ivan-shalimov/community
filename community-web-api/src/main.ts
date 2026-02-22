import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ICommonConfig } from './config/interfaces';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = await app.resolve<ConfigService>(ConfigService);
  const config = configService.getOrThrow<ICommonConfig>('common');

  await app.listen(config.port);
  console.log(`Application is running on: http://localhost:${config.port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
