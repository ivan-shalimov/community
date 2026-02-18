import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { ICommonConfig, IMailerConfig } from './interfaces';
import { MailerOptions } from '@nestjs-modules/mailer';

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
