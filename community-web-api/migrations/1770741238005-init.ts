import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1770741238005 implements MigrationInterface {
  name = 'Init1770741238005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "member" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_4678079964ab375b2b31849456c" UNIQUE ("email"),
                CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "member_invite" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                CONSTRAINT "UQ_44b26d6a44614b937d36c211f66" UNIQUE ("token"),
                CONSTRAINT "UQ_5b4202b7385c69401bc94087f57" UNIQUE ("email"),
                CONSTRAINT "PK_ad218fc9af22b90a68b2e839850" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "member_invite"
        `);
    await queryRunner.query(`
            DROP TABLE "member"
        `);
  }
}
