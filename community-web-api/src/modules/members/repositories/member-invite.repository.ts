import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MemberInvite } from '../entities/member-invite.entity';

@Injectable()
export class MemberInviteRepository {
  constructor(
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  getByEmail(email: string): Promise<MemberInvite | null> {
    return this.memberInvitesRepository.findOneBy({ email });
  }

  getByTokenAndEmail(token: string, email: string): Promise<MemberInvite | null> {
    return this.memberInvitesRepository.findOneBy({ token, email });
  }

  create(entity: Partial<MemberInvite>): MemberInvite {
    return this.memberInvitesRepository.create(entity);
  }

  save(entity: MemberInvite): Promise<MemberInvite> {
    return this.memberInvitesRepository.save(entity);
  }
}
