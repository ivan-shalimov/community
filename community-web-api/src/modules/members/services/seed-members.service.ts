import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { ICommonConfig } from '../../../config/interfaces';
import { MembersService } from './members.service';

@Injectable()
export class SeedMemberService implements OnApplicationBootstrap {
  constructor(
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const config = this.configService.getOrThrow<ICommonConfig>('common');

    const existingAdmin = await this.membersService.hasMemberWith(
      config.adminEmail,
    );
    if (existingAdmin) {
      return;
    }

    await this.membersService.createInvite({
      name: config.adminName,
      email: config.adminEmail,
    });
  }
}
