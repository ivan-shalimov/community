import { ConflictException, Injectable } from '@nestjs/common';

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
      throw new ConflictException(
        `Unexpected error while handling operation. Please verify that the invite token is correct and has not expired.`,
      );
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
  ): Promise<void> {
    const result = await this.membersRepository.update(id, {
      name: updateMemberNameDto.name,
    });
    if (result.affected === 0) {
      throw new ConflictException(
        `Unexpected error while updating member with id ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.membersRepository.delete(id);
    if (result.affected === 0) {
      throw new ConflictException(
        `Unexpected error while deleting member with id ${id}`,
      );
    }
  }
}
