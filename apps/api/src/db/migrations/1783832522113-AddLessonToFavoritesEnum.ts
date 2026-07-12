import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonToFavoritesEnum1783832522113 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `favorites` MODIFY COLUMN `type` ENUM('course','article','lesson') NOT NULL",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `favorites` MODIFY COLUMN `type` ENUM('course','article') NOT NULL",
        );
    }

}
