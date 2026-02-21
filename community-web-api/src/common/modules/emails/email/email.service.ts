import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { ICommonConfig } from '../../../../config/interfaces';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMemberInviteEmail(
    name: string,
    email: string,
    token: string,
  ): Promise<void> {
    const config = this.configService.getOrThrow<ICommonConfig>('common');

    await this.mailerService.sendMail({
      to: {
        name,
        address: email,
      },
      subject: 'You are invited to join Community',
      template: 'invite',
      context: {
        name,
        adminName: config.adminName,
        token: encodeURIComponent(token),
        email: encodeURIComponent(email),
        portalUrl: config.portalUrl,
      },
    });
  }
}
