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

import {
  CreateMemberInviteDto,
  ListOptionsDto,
  MemberDto,
  RegisterMemberDto,
  ResultDto,
  UpdateMemberNameDto,
  ValidateMemberInviteDto,
} from './dto';
import { MembersService } from './services';

@Controller('api/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('invite')
  invite(@Body() inviteMemberDto: CreateMemberInviteDto): Promise<void> {
    return this.membersService.createInvite(inviteMemberDto);
  }

  @Get('invite/verify/:token')
  async verify(
    @Query() validateMemberInviteDto: ValidateMemberInviteDto,
  ): Promise<ResultDto> {
    await this.membersService.findInviteByTokenAndEmailOrThrowError(
      validateMemberInviteDto.token,
      validateMemberInviteDto.email,
    );

    return new ResultDto(true);
  }

  @Post('register')
  async register(
    @Body() registerMemberDto: RegisterMemberDto,
  ): Promise<MemberDto> {
    const invite =
      await this.membersService.findInviteByTokenAndEmailOrThrowError(
        registerMemberDto.token,
        registerMemberDto.email,
      );

    return this.membersService.register(invite, registerMemberDto);
  }

  @Get()
  find(@Query() listOptionsDto: ListOptionsDto): Promise<MemberDto[]> {
    return this.membersService
      .find(listOptionsDto)
      .then((entities) =>
        entities.map((entity) => MemberDto.fromEntity(entity)),
      );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MemberDto> {
    const member = await this.membersService.findByIdOrThrowError(id);
    return MemberDto.fromEntity(member);
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
