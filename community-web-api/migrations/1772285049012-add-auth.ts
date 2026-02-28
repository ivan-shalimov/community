import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuth1772285049012 implements MigrationInterface {
  name = 'AddAuth1772285049012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" ADD "created_at" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "members" ADD "password" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "members" ADD "salt" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "salt"`);
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "created_at"`);
  }
}
