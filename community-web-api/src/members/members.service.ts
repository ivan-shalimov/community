import { Injectable, NotFoundException } from '@nestjs/common';
import { Member } from './entities/member.entity';
import { CreateMemberDto, UpdateMemberDto, MemberDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class MembersService {
  private memberlist: Member[] = [];

  create(createMemberDto: CreateMemberDto): Promise<MemberDto> {
    const entity = new Member();
    entity.id = crypto.randomUUID();
    entity.name = createMemberDto.name;

    this.memberlist.push(entity);

    return Promise.resolve(MemberDto.fromEntity(entity));
  }

  findAll(): Promise<MemberDto[]> {
    return Promise.resolve(this.memberlist.map((e) => MemberDto.fromEntity(e)));
  }

  findById(id: string): Promise<MemberDto> {
    const entity = this.memberlist.find((e) => e.id == id);
    if (entity == null) {
      throw new NotFoundException('entity is not found');
    }

    return Promise.resolve(MemberDto.fromEntity(entity));
  }

  findByName(name: string): Promise<MemberDto | undefined> {
    const entity = this.memberlist.find((e) => e.name.includes(name));
    return Promise.resolve(entity && MemberDto.fromEntity(entity));
  }

  update(id: string, updateMemberDto: UpdateMemberDto): Promise<MemberDto> {
    const entity = this.memberlist.find((e) => e.id == id);
    if (entity == undefined) {
      throw new NotFoundException('entity is not found');
    }

    if (updateMemberDto.name !== undefined) {
      entity.name = updateMemberDto.name;
    }

    return Promise.resolve(MemberDto.fromEntity(entity));
  }

  remove(id: string): Promise<void> {
    const indexId = this.memberlist.findIndex((e) => e.id == id);

    if (indexId > 0) {
      throw new NotFoundException('entity is not found');
    }

    this.memberlist.splice(indexId, 1);

    return Promise.resolve();
  }
}
