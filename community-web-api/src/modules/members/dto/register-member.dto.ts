import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterMemberDto {
  @IsNotEmpty()
  token!: string;

  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
