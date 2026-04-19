import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sessions' })
// This entity represents a session of a member in the community.
// It is used to track the sessions that have been created when members log in.
export class Session {
  @PrimaryGeneratedColumn('uuid')
  // The unique identifier for the session.
  id!: string;

  @Column()
  // The ID of the member.
  memberId!: string;

  @Column({ name: 'created_at' })
  // The date and time when the session was created.
  createdAt!: Date;

  @Column({ name: 'expired_at' })
  // The date and time when the session expires.
  expiredAt!: Date;
}
