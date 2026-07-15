import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArticleSeoAndStaffType1784111502000 implements MigrationInterface {
    name = "AddArticleSeoAndStaffType1784111502000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // articles: SEO metadata columns
        await queryRunner.query(
            "ALTER TABLE `articles` ADD `meta_title` json NULL",
        );
        await queryRunner.query(
            "ALTER TABLE `articles` ADD `meta_description` json NULL",
        );
        await queryRunner.query(
            "ALTER TABLE `articles` ADD `meta_keywords` json NULL",
        );
        await queryRunner.query(
            "ALTER TABLE `articles` ADD `robots` enum ('index', 'noindex') NOT NULL DEFAULT 'index'",
        );

        // instructors: staff role type (instructor vs author)
        await queryRunner.query(
            "ALTER TABLE `instructors` ADD `staff_type` enum ('instructor', 'author') NOT NULL DEFAULT 'instructor'",
        );

        // users: add 'author' to the role enum
        await queryRunner.query(
            "ALTER TABLE `users` MODIFY COLUMN `role` enum ('user', 'instructor', 'author', 'admin') NOT NULL DEFAULT 'user'",
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE `users` MODIFY COLUMN `role` enum ('user', 'instructor', 'admin') NOT NULL DEFAULT 'user'",
        );
        await queryRunner.query(
            "ALTER TABLE `instructors` DROP COLUMN `staff_type`",
        );
        await queryRunner.query("ALTER TABLE `articles` DROP COLUMN `robots`");
        await queryRunner.query(
            "ALTER TABLE `articles` DROP COLUMN `meta_keywords`",
        );
        await queryRunner.query(
            "ALTER TABLE `articles` DROP COLUMN `meta_description`",
        );
        await queryRunner.query(
            "ALTER TABLE `articles` DROP COLUMN `meta_title`",
        );
    }
}
