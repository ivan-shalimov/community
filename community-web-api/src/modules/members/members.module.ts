import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './services/members.service';
import { MembersController } from './members.controller';
import { SeedMemberService } from './services/seed-members.service';
import { Member } from './entities/member.entity';
import { MemberInvite } from './entities/member-invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberInvite])],
  controllers: [MembersController],
  providers: [MembersService, SeedMemberService],
})
export class MembersModule {}
