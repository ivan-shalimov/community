import { randomBytes } from 'crypto';

import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '../entities/member.entity';
import {
  RegisterMemberDto,
  UpdateMemberNameDto,
  MemberDto,
  CreateMemberInviteDto,
  ListOptionsDto,
} from '../dto';
import { MemberInvite } from '../entities';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async register(
    invite: MemberInvite,
    registerMemberDto: RegisterMemberDto,
  ): Promise<MemberDto> {
    return this.membersRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const membersRepository =
          transactionalEntityManager.getRepository(Member);
        const memberInvitesRepository =
          transactionalEntityManager.getRepository(MemberInvite);

        const entity = membersRepository.create(registerMemberDto);
        await membersRepository.save(entity);
        await memberInvitesRepository.delete(invite.id);
        return MemberDto.fromEntity(entity);
      },
    );
  }

  find(options: ListOptionsDto): Promise<Member[]> {
    return this.membersRepository.find({
      skip: (options.page - 1) * options.pageSize,
      take: options.pageSize,
    });
  }

  findByIdOrThrowError(id: string): Promise<Member> {
    return this.membersRepository.findOneBy({ id }).then((entity) => {
      if (entity == null) {
        throw new BadRequestException(`Member with id ${id} not found`);
      }

      return entity;
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

  async createInvite(
    createMemberInviteDto: CreateMemberInviteDto,
  ): Promise<void> {
    const existingInvite = await this.memberInvitesRepository.findOneBy({
      email: createMemberInviteDto.email,
    });

    if (existingInvite) {
      // If an invite already exists for the email, we can choose to either:
      // 1. Return the existing invite (not recommended for security reasons)
      // 2. Generate a new token and update the existing invite
      // Here, we'll go with option 2 for better security.

      existingInvite.token = randomBytes(64).toString('base64');
      await this.memberInvitesRepository.save(existingInvite);
      return;
    }

    const entity = this.memberInvitesRepository.create(createMemberInviteDto);

    entity.token = randomBytes(64).toString('base64');

    await this.memberInvitesRepository.save(entity);
  }

  async findInviteByTokenAndEmailOrThrowError(
    token: string,
    email: string,
  ): Promise<MemberInvite> {
    const invite = await this.memberInvitesRepository.findOneBy({
      token,
      email,
    });
    if (invite == null) {
      throw new BadRequestException(
        `Member invite with token ${token} and email ${email} not found`,
      );
    }

    return invite;
  }
}
