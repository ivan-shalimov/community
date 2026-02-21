import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';

import { mailerOptionsFactory } from '../../../../config/mailer.factory';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
// todo - convert to library and move to common folder
