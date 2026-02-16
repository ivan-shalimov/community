import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = await app.resolve<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
