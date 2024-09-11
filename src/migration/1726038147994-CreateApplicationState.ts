import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApplicationState1726038147994 implements MigrationInterface {
    name = 'CreateApplicationState1726038147994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "application_state_entity" ("id" SERIAL NOT NULL, "applicationName" character varying NOT NULL, "metric" character varying NOT NULL, "url" character varying NOT NULL, "result" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_129eba7885640a291eb49218ed3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "application_state_entity"`);
    }

}
