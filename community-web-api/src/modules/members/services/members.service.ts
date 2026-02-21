import { BadRequestException, Injectable } from '@nestjs/common';

import { CryptoHelper } from '../../../common/crypto.helper';
import { EmailService } from '../../../common/modules/emails/email/email.service';

import { CreateMemberInviteDto } from '../dto/create-member-invite.dto';
import { ListOptionsDto } from '../dto/list-options.dto';
import { RegisterMemberDto } from '../dto/register-member.dto';
import { UpdateMemberNameDto } from '../dto/update-member-name.dto';

import { MemberInvite } from '../entities/member-invite.entity';
import { Member } from '../entities/member.entity';

import { MemberInviteRepository } from '../repositories/member-invite.repository';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MembersService {
  constructor(
    private readonly emailService: EmailService,
    private readonly memberRepository: MemberRepository,
    private readonly memberInviteRepository: MemberInviteRepository,
  ) {}

  async register(invite: MemberInvite, registerMemberDto: RegisterMemberDto): Promise<Member> {
    const entity = await this.memberRepository.registerMemberAndConsumeInvite(
      registerMemberDto,
      invite.id,
    );
    return entity;
  }

  find(options: ListOptionsDto): Promise<Member[]> {
    return this.memberRepository.getList(options.page, options.pageSize);
  }

  findByIdOrThrowError(id: string): Promise<Member> {
    return this.memberRepository.getById(id).then((entity) => {
      if (entity == null) {
        throw new BadRequestException(`Member with id ${id} not found`);
      }

      return entity;
    });
  }

  hasMemberWith(email: string): Promise<boolean> {
    return this.memberRepository.getByEmail(email).then((entity) => entity != null);
  }

  async updateName(id: string, updateMemberNameDto: UpdateMemberNameDto): Promise<void> {
    await this.memberRepository.updateName(id, updateMemberNameDto.name);
  }

  async remove(id: string): Promise<void> {
    await this.memberRepository.remove(id);
  }

  async createInvite(createMemberInviteDto: CreateMemberInviteDto): Promise<void> {
    let invite = await this.memberInviteRepository.getByEmail(createMemberInviteDto.email);

    if (invite == null) {
      invite = this.memberInviteRepository.create(createMemberInviteDto);
    }

    invite.token = CryptoHelper.generateRandomToken(64);

    await this.memberInviteRepository.save(invite);

    await this.emailService.sendMemberInviteEmail(
      createMemberInviteDto.name,
      createMemberInviteDto.email,
      invite.token,
    );
  }

  async findInviteByTokenAndEmailOrThrowError(token: string, email: string): Promise<MemberInvite> {
    const invite = await this.memberInviteRepository.getByTokenAndEmail(token, email);
    if (invite == null) {
      throw new BadRequestException(
        `Member invite with token ${token} and email ${email} not found`,
      );
    }

    return invite;
  }
}
