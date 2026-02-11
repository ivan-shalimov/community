import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '../entities/member.entity';
import { RegisterMemberDto, UpdateMemberNameDto, MemberDto } from '../dto';
import { MemberInvite } from '../entities';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async register(registerMemberDto: RegisterMemberDto): Promise<MemberDto> {
    // todo consider to use cache to reduce the number of queries to database within one request
    const invite = await this.memberInvitesRepository.findOneBy({
      token: registerMemberDto.token,
      email: registerMemberDto.email,
    });

    return this.membersRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const membersRepository =
          transactionalEntityManager.getRepository(Member);
        const memberInvitesRepository =
          transactionalEntityManager.getRepository(MemberInvite);

        const entity = membersRepository.create(registerMemberDto);
        await membersRepository.save(entity);
        // use `invite!` since the existence of the invite is already checked with validation pipe
        await memberInvitesRepository.delete(invite!.id);
        return MemberDto.fromEntity(entity);
      },
    );
  }

  findAll(): Promise<MemberDto[]> {
    return this.membersRepository
      .find()
      .then((entities) => entities.map((e) => MemberDto.fromEntity(e)));
  }

  findById(id: string): Promise<MemberDto | null> {
    return this.membersRepository.findOneBy({ id }).then((entity) => {
      if (entity == null) {
        return null;
      }

      return MemberDto.fromEntity(entity);
    });
  }

  findByName(name: string): Promise<MemberDto | null> {
    return this.membersRepository.findOneBy({ name }).then((entity) => {
      if (entity == null) {
        return null;
      }

      return MemberDto.fromEntity(entity);
    });
  }

  async updateName(
    id: string,
    updateMemberNameDto: UpdateMemberNameDto,
  ): Promise<void> {
    await this.membersRepository.update(id, {
      name: updateMemberNameDto.name,
    });
  }

  async remove(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }
}
