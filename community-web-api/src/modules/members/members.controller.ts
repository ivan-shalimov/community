import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { MembersService, MembersInviteService } from './services';
import {
  CreateMemberInviteDto,
  RegisterMemberDto,
  UpdateMemberNameDto,
} from './dto';

@Controller('api/members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly membersInviteService: MembersInviteService,
  ) {}

  @Post('invite')
  invite(@Body() inviteMemberDto: CreateMemberInviteDto) {
    return this.membersInviteService.create(inviteMemberDto);
  }

  @Get('invite/verify/:token')
  async verify(@Param('token') token: string, @Query('email') email: string) {
    const result = await this.membersInviteService.verify(token, email);
    if (result) {
      return { valid: true };
    } else {
      throw new ForbiddenException('Invalid Token');
    }
  }

  @Post('register')
  register(@Body() registerMemberDto: RegisterMemberDto) {
    return this.membersService.register(registerMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findById(id);
  }

  @Put(':id/name')
  update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberNameDto,
  ) {
    return this.membersService.updateName(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
