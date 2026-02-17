import { ConfigModule, ConfigService } from '@nestjs/config';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailerConfig } from './interfaces';
import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerOptionsFactory = async (
  configService: ConfigService,
): Promise<MailerOptions> => {
  // Ensure that environment variables are loaded before accessing them
  await ConfigModule.envVariablesLoaded;

  const config = configService.getOrThrow<MailerConfig>('mailer');

  return {
    transport: {
      host: config.host,
      port: config.port,
      secure: false,
      ignoreTLS: true,
    },
    defaults: {
      from: `"${config.adminName}" <${config.adminEmail}>`,
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
