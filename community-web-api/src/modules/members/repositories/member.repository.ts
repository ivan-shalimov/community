import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RegisterMemberDto } from '../dto/register-member.dto';

import { MemberInvite } from '../entities/member-invite.entity';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  getList(page: number, pageSize: number): Promise<Member[]> {
    return this.membersRepository.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  getById(id: string): Promise<Member | null> {
    return this.membersRepository.findOneBy({ id });
  }

  getByEmail(email: string): Promise<Member | null> {
    return this.membersRepository.findOneBy({ email });
  }

  async updateName(id: string, name: string): Promise<void> {
    await this.membersRepository.update(id, { name });
  }

  async remove(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }

  registerMemberAndConsumeInvite(
    registerMemberDto: RegisterMemberDto,
    inviteId: string,
  ): Promise<Member> {
    return this.membersRepository.manager.transaction(async (transactionalEntityManager) => {
      const membersRepository = transactionalEntityManager.getRepository(Member);
      const memberInvitesRepository = transactionalEntityManager.getRepository(MemberInvite);

      const entity = membersRepository.create(registerMemberDto);
      await membersRepository.save(entity);
      await memberInvitesRepository.delete(inviteId);

      return entity;
    });
  }
}
