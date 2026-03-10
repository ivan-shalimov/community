import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessions1773165632276 implements MigrationInterface {
  name = 'AddSessions1773165632276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "memberId" character varying NOT NULL, 
                "created_at" TIMESTAMP NOT NULL, 
                "expired_at" TIMESTAMP NOT NULL, 
                CONSTRAINT "PK_Session" PRIMARY KEY ("id")
            )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sessions"`);
  }
}
