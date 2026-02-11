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
import { InviteValidationPipe, MemberExistsPipe } from './validation';

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
  // todo investigate how better to validate query params and path params together, maybe custom pipe that validates both at the same time
  async verify(@Param('token') token: string, @Query('email') email: string) {
    const result = await this.membersInviteService.verify(token, email);
    if (result) {
      return { valid: true };
    } else {
      throw new ForbiddenException('Invalid Token');
    }
  }

  @Post('register')
  register(@Body(InviteValidationPipe) registerMemberDto: RegisterMemberDto) {
    return this.membersService.register(registerMemberDto);
  }

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MemberExistsPipe) id: string) {
    return this.membersService.findById(id);
  }

  @Put(':id/name')
  update(
    @Param('id', MemberExistsPipe) id: string,
    @Body() updateMemberDto: UpdateMemberNameDto,
  ) {
    return this.membersService.updateName(id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id', MemberExistsPipe) id: string) {
    return this.membersService.remove(id);
  }
}
