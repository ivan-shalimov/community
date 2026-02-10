import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { InviteExistsRule } from '../validation';

export class RegisterMemberDto {
  @IsNotEmpty()
  @Validate(InviteExistsRule)
  token!: string;

  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
