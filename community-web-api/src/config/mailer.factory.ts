import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { ICommonConfig, IMailerConfig } from './interfaces';

export const mailerOptionsFactory = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  // Ensure that environment variables are loaded before accessing them
  await ConfigModule.envVariablesLoaded;

  const mailerConfig = configService.getOrThrow<IMailerConfig>('mailer');
  const commonConfig = configService.getOrThrow<ICommonConfig>('common');

  return {
    transport: {
      host: mailerConfig.host,
      port: mailerConfig.port,
      secure: false,
      ignoreTLS: true,
    },
    defaults: {
      from: `"${commonConfig.adminName}" <${commonConfig.adminEmail}>`,
    },
    template: {
      dir: path.join(process.cwd(), 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
