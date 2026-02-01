import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from './entities/member.entity';
import { CreateMemberDto, UpdateMemberDto, MemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<MemberDto> {
    const entity = new Member();
    entity.name = createMemberDto.name;

    await this.membersRepository.save(entity);
    return MemberDto.fromEntity(entity);
  }

  findAll(): Promise<MemberDto[]> {
    return this.membersRepository
      .find()
      .then((entities) => entities.map((e) => MemberDto.fromEntity(e)));
  }

  findById(id: string): Promise<MemberDto | null> {
    return this.membersRepository.findOneBy({ id }).then((entity) => {
      if (entity == null) {
        return null;
      }

      return MemberDto.fromEntity(entity);
    });
  }

  findByName(name: string): Promise<MemberDto | null> {
    return this.membersRepository.findOneBy({ name }).then((entity) => {
      if (entity == null) {
        return null;
      }

      return MemberDto.fromEntity(entity);
    });
  }

  async update(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberDto> {
    const entity = await this.membersRepository.findOneBy({ id });
    if (entity == undefined) {
      throw new NotFoundException('entity is not found');
    }

    entity.name = updateMemberDto.name;

    await this.membersRepository.save(entity);
    return MemberDto.fromEntity(entity);
  }

  async remove(id: string): Promise<void> {
    await this.membersRepository.delete(id);
  }
}
