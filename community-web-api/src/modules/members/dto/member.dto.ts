import { Member } from '../entities/member.entity';

export class MemberDto {
  constructor(
    public id: string,
    public name: string,
    public email: string,
  ) {}

  static fromEntity = (entity: Member): MemberDto =>
    new MemberDto(entity.id, entity.name, entity.email);
}
