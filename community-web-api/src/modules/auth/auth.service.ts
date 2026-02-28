import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CryptoHelper } from '../../common/crypto.helper';
import { MembersService } from '../members/services/members.service';
import { JwtPayload } from './models/jwt-payload';
import { LoginResponseDto } from './models/login-response.dto';
import { UserData } from './models/user.data';

@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
  ) {}

  async signIn(member: UserData): Promise<LoginResponseDto> {
    const payload = new JwtPayload(member.id, member.email, member.name);

    const accessToken = await this.jwtService.signAsync({ ...payload });
    return new LoginResponseDto(accessToken);
  }

  async validateUser(email: string, password: string): Promise<UserData | null> {
    const member = await this.membersService.findByEmail(email);
    if (member == null) {
      return null;
    }

    if (!(await CryptoHelper.verifyPassword(member.password, password))) {
      return null;
    }

    return new UserData(member.id, member.email, member.name);
  }
}
