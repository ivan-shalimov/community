import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { mailerOptionsFactory } from '../../../../config';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';

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
