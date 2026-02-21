import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';

import { CreateMemberInviteDto } from './dto/create-member-invite.dto';
import { ListOptionsDto } from './dto/list-options.dto';
import { MemberResponseDto } from './dto/member-response.dto';
import { RegisterMemberDto } from './dto/register-member.dto';
import { ResultResponseDto } from './dto/result-response.dto';
import { UpdateMemberNameDto } from './dto/update-member-name.dto';
import { ValidateMemberInviteDto } from './dto/validate-member-invite.dto';
import { MembersService } from './services/members.service';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('invite')
  invite(@Body() inviteMemberDto: CreateMemberInviteDto): Promise<void> {
    return this.membersService.createInvite(inviteMemberDto);
  }

  @Get('invite/verify')
  async verify(
    @Query() validateMemberInviteDto: ValidateMemberInviteDto,
  ): Promise<ResultResponseDto> {
    await this.membersService.findInviteByTokenAndEmailOrThrowError(
      validateMemberInviteDto.token,
      validateMemberInviteDto.email,
    );

    return new ResultResponseDto(true);
  }

  @Post('register')
  async register(
    @Body() registerMemberDto: RegisterMemberDto,
  ): Promise<MemberResponseDto> {
    const invite =
      await this.membersService.findInviteByTokenAndEmailOrThrowError(
        registerMemberDto.token,
        registerMemberDto.email,
      );

    return this.membersService.register(invite, registerMemberDto);
  }

  @Get()
  async find(
    @Query() listOptionsDto: ListOptionsDto,
  ): Promise<MemberResponseDto[]> {
    const entities = await this.membersService.find(listOptionsDto);
    return entities.map((entity) => MemberResponseDto.fromEntity(entity));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MemberResponseDto> {
    const member = await this.membersService.findByIdOrThrowError(id);
    return MemberResponseDto.fromEntity(member);
  }

  @Put(':id/name')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberNameDto,
  ): Promise<void> {
    await this.membersService.findByIdOrThrowError(id);
    await this.membersService.updateName(id, updateMemberDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.membersService.findByIdOrThrowError(id);
    await this.membersService.remove(id);
  }
}
