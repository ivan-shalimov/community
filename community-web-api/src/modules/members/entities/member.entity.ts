import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'members' })
// This entity represents a member of the community.
// It is used to track the members that have been created when invites are accepted.
export class Member {
  @PrimaryGeneratedColumn('uuid')
  // The unique identifier for the member.
  id!: string;

  @Column()
  // The name of the member.
  name!: string;

  @Column({ unique: true })
  // The email of the member.
  email!: string;
}
