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
    // todo implement checking portal admin user and send invite if not exist
  }
}
