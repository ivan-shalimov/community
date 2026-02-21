import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1770741238005 implements MigrationInterface {
  name = 'Init1770741238005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "members" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_MEMBER_EMAIL" UNIQUE ("email"),
                CONSTRAINT "PK_MEMBER" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "member_invites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_MEMBER_INVITE_TOKEN" UNIQUE ("token"),
                CONSTRAINT "UQ_MEMBER_INVITE_EMAIL" UNIQUE ("email"),
                CONSTRAINT "PK_MEMBER_INVITE" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "member_invites"
        `);
    await queryRunner.query(`
            DROP TABLE "members"
        `);
  }
}
