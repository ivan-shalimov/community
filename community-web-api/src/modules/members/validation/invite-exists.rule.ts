import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Repository } from 'typeorm';

import { MemberInvite } from '../entities';

@ValidatorConstraint({ name: 'InviteExists', async: true })
@Injectable()
export class InviteExistsRule implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(MemberInvite)
    private memberInvitesRepository: Repository<MemberInvite>,
  ) {}

  async validate(value: string) {
    const user = await this.memberInvitesRepository.findOne({
      where: { token: value },
    });
    return !!user;
  }

  defaultMessage() {
    return 'Invite does not exist';
  }
}

export function InviteExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'InviteExists',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: InviteExistsRule,
    });
  };
}
