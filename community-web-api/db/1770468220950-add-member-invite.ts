import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMemberInvite1770468220950 implements MigrationInterface {
  name = 'AddMemberInvite1770468220950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "member_invite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "PK_ad218fc9af22b90a68b2e839850" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "member"
            ADD "email" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "member" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            DROP TABLE "member_invite"
        `);
  }
}
