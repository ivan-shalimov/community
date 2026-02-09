import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// This entity represents an invite to become a member of the community.
// It is used to track invites that have been sent out and to identify the member that will be created when the invite is accepted.
export class MemberInvite {
  @PrimaryGeneratedColumn('uuid')
  // The id of the invite. This is a UUID that is generated when the invite is created.
  id!: string;

  @Column()
  // This is a random token that is used to identify the invite. It should be unique and not guessable.
  token!: string;

  @Column()
  // The name of the person being invited.
  // This is not necessarily the name of the member that will be created, but it can be used to personalize the invite email.
  name!: string;

  @Column()
  // The email of the person being invited.
  // This is used to send the invite email and to identify the member that will be created when the invite is accepted.
  email!: string;

  // todo add expiration date and logic to remove expired invites
}
