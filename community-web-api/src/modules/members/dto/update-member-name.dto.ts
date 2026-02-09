import { IsNotEmpty } from 'class-validator';

export class UpdateMemberNameDto {
  @IsNotEmpty()
  name!: string;
}
