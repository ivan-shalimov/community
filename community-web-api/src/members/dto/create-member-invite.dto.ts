import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberInviteDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
