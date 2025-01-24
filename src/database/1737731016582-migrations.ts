import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737731016582 implements MigrationInterface {
    name = "Migrations1737731016582";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."deliveries_status_enum" AS ENUM('pending', 'in_progress', 'delivered')`,
        );
        await queryRunner.query(
            `CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "shop_name" character varying NOT NULL, "comment" character varying, "status" "public"."deliveries_status_enum" NOT NULL DEFAULT 'pending', "shop_location" point NOT NULL, "user_location" point NOT NULL, "deliverer_id" uuid, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "deliveries"`);
        await queryRunner.query(`DROP TYPE "public"."deliveries_status_enum"`);
    }
}
