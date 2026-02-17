import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { Member } from '../entities';
import { MailerConfig } from '../../../config/interfaces';

@Injectable()
export class SeedMemberService implements OnApplicationBootstrap {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const config = this.configService.getOrThrow<MailerConfig>('mailer');

    const existingAdmin = await this.membersRepository.findOne({
      where: { email: config.adminEmail },
    });
    if (existingAdmin) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sendResult: any = await this.mailerService.sendMail({
      to: `"${config.adminName}" <${config.adminEmail}>`,
      from: `"${config.adminName}" <${config.adminEmail}>`,
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // plaintext body
      html: '<b>welcome</b>', // HTML body content
    });

    // todo improve when logger is implemented
    console.log('sendResult', sendResult);
  }
}
