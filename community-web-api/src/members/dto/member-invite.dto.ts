import { MemberInvite } from '../entities';

export class MemberInviteDto {
  constructor(
    public id: string,
    public token: string,
    public email: string,
  ) {}

  static fromEntity = (entity: MemberInvite): MemberInviteDto =>
    new MemberInviteDto(entity.id, entity.token, entity.email);
}
