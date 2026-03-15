import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Session } from '../entities/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  getById(id: string): Promise<Session | null> {
    return this.sessionsRepository.findOneBy({ id });
  }

  create(entity: Partial<Session>): Session {
    return this.sessionsRepository.create(entity);
  }

  save(entity: Session): Promise<Session> {
    return this.sessionsRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.sessionsRepository.delete(id);
  }
}
