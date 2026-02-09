import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Member } from '../entities';

@Injectable()
export class SeedMemberService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Member)
    private readonly membersService: Repository<Member>,
  ) {}

  async onApplicationBootstrap() {
    if (process.env.e2e == 'true') {
      const name = 'e2e test memeber';
      const exists = await this.membersService.findOne({ where: { name } });
      if (!exists) {
        await this.membersService.save({ name });
      }
    }
  }
}
