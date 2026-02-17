import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

import { MailerModule } from '@nestjs-modules/mailer';
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  typeOrmOptionsFactory,
  configuration,
  mailerOptionsFactory,
} from './config';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { MembersModule } from './modules/members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmOptionsFactory,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerOptionsFactory,
      inject: [ConfigService],
    }),
    MembersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
