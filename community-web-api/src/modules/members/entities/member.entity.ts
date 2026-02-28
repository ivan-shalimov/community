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

  @Column({ name: 'created_at' })
  // The date and time when the member was created.
  createdAt!: Date;

  @Column()
  // The hashed password of the member.
  password!: string;

  @Column()
  // The salt used to hash the password.
  salt!: string;
}
