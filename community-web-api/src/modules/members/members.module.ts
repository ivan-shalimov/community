import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersService } from './services/members.service';
import { SeedMemberService } from './services/seed-members.service';

import { MemberInvite } from './entities/member-invite.entity';
import { Member } from './entities/member.entity';
import { MembersController } from './members.controller';
import { MemberInviteRepository } from './repositories/member-invite.repository';
import { MemberRepository } from './repositories/member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberInvite])],
  controllers: [MembersController],
  providers: [MembersService, SeedMemberService, MemberRepository, MemberInviteRepository],
  exports: [MembersService],
})
export class MembersModule {}
