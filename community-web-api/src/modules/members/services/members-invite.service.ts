import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberInvite } from '../entities';
import { CreateMemberInviteDto, MemberInviteDto } from '../dto';

@Injectable()
export class MembersInviteService {
  constructor(
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async create(createMemberInviteDto: CreateMemberInviteDto): Promise<void> {
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

  findByToken(token: string): Promise<MemberInviteDto | null> {
    return this.memberInvitesRepository.findOneBy({ token }).then((entity) => {
      if (entity == null) {
        return null;
      }

      return MemberInviteDto.fromEntity(entity);
    });
  }

  async remove(id: string): Promise<void> {
    await this.memberInvitesRepository.delete(id);
  }

  async verify(token: string, email: string): Promise<MemberInviteDto | null> {
    return this.memberInvitesRepository
      .findOneBy({ token, email })
      .then((entity) => {
        if (entity == null) {
          return null;
        }

        return MemberInviteDto.fromEntity(entity);
      });
  }
}
