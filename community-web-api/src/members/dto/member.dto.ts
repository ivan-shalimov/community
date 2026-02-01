import { Member } from '../entities/member.entity';

export class MemberDto {
  id: string;
  name: string;

  static fromEntity(entity: Member): MemberDto {
    const dto = new MemberDto();
    dto.id = entity.id;
    dto.name = entity.name;
    return dto;
  }
}
