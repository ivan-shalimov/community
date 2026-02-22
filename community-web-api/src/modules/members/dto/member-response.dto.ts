import { Member } from '../entities/member.entity';

export class MemberResponseDto {
  constructor(
    public id: string,
    public name: string,
    public email: string,
  ) {}

  static fromEntity = (entity: Member): MemberResponseDto =>
    new MemberResponseDto(entity.id, entity.name, entity.email);
}
