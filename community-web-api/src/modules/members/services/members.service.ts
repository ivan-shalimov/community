import { randomBytes } from 'crypto';

import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from '../entities/member.entity';
import {
  RegisterMemberDto,
  UpdateMemberNameDto,
  MemberResponseDto,
  CreateMemberInviteDto,
  ListOptionsDto,
} from '../dto';
import { MemberInvite } from '../entities';
import { EmailService } from '../../../common/modules/emails/email/email.service';

@Injectable()
export class MembersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async register(
    invite: MemberInvite,
    registerMemberDto: RegisterMemberDto,
  ): Promise<MemberResponseDto> {
    return this.membersRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const membersRepository =
          transactionalEntityManager.getRepository(Member);
        const memberInvitesRepository =
          transactionalEntityManager.getRepository(MemberInvite);

        const entity = membersRepository.create(registerMemberDto);
        await membersRepository.save(entity);
        await memberInvitesRepository.delete(invite.id);
        return MemberResponseDto.fromEntity(entity);
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

  hasMemberWith(email: string): Promise<boolean> {
    return this.membersRepository
      .findOneBy({ email })
      .then((entity) => entity != null);
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
    let invite = await this.memberInvitesRepository.findOneBy({
      email: createMemberInviteDto.email,
    });

    if (invite == null) {
      invite = this.memberInvitesRepository.create(createMemberInviteDto);
    }

    invite.token = randomBytes(64).toString('base64');

    await this.memberInvitesRepository.save(invite);

    await this.emailService.sendMemberInviteEmail(
      createMemberInviteDto.name,
      createMemberInviteDto.email,
      invite.token,
    );
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
