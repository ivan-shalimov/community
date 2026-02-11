import { Injectable, BadRequestException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { MemberInvite } from '../entities';
import { RegisterMemberDto } from '../dto';

@Injectable()
export class InviteValidationPipe implements PipeTransform {
  constructor(
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async transform(dto: RegisterMemberDto) {
    const memberInvite = await this.memberInvitesRepository.findOne({
      where: { token: dto.token, email: dto.email },
    });
    if (!memberInvite) {
      throw new BadRequestException(
        `Member invite with token ${dto.token} and email ${dto.email} not found`,
      );
    }
    return dto;
  }
}
