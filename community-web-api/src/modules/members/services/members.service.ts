import { Injectable, NotFoundException } from '@nestjs/common';

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
    const invite = await this.memberInvitesRepository.findOneBy({
      token: registerMemberDto.token,
      email: registerMemberDto.email,
    });

    if (!invite) {
      throw new NotFoundException('Invite not found for the provided email');
    }

    const entity = this.membersRepository.create(registerMemberDto);

    await this.membersRepository.save(entity);
    await this.memberInvitesRepository.delete(invite.id);
    return MemberDto.fromEntity(entity);
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
  ): Promise<MemberDto> {
    const entity = await this.membersRepository.findOneBy({ id });
    if (entity == null) {
      throw new NotFoundException('entity is not found');
    }

    entity.name = updateMemberNameDto.name;

    await this.membersRepository.save(entity);
    return MemberDto.fromEntity(entity);
  }

  async remove(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }
}
