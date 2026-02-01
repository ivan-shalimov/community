import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MembersService } from './members.service';

@Injectable()
export class SeedMemberService implements OnApplicationBootstrap {
  constructor(private readonly membersService: MembersService) {}

  async onApplicationBootstrap() {
    console.log(process.env);
    if (process.env.e2e == 'true') {
      const name = 'e2e test memeber';
      const exists = await this.membersService.findByName(name);
      if (!exists) {
        await this.membersService.create({ name });
      }
    }
  }
}
