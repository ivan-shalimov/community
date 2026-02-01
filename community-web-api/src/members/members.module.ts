import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { SeedMemberService } from './seed-members.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, SeedMemberService],
})
export class MembersModule {}
