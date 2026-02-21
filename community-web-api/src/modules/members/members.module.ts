import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './services';
import { MembersController } from './members.controller';
import { SeedMemberService } from './services/seed-members.service';
import { Member, MemberInvite } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberInvite])],
  controllers: [MembersController],
  providers: [MembersService, SeedMemberService],
})
export class MembersModule {}
