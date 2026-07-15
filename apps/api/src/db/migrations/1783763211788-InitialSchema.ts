import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1783763211788 implements MigrationInterface {
    name = 'InitialSchema1783763211788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`instructors\` (\`id\` varchar(36) NOT NULL, \`name\` json NOT NULL, \`slug\` varchar(255) NOT NULL, \`avatar_url\` varchar(255) NULL, \`bio\` json NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1855c63bfc5515a0ef3b6ffb82\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` varchar(36) NOT NULL, \`name\` json NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` json NULL, \`thumbnail_url\` json NULL, \`order\` int NOT NULL DEFAULT '0', \`parent_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` varchar(36) NULL, UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`id\` varchar(36) NOT NULL, \`title\` json NOT NULL, \`slug\` varchar(255) NOT NULL, \`summary\` json NOT NULL, \`body_ar\` longtext NOT NULL, \`body_ur\` longtext NOT NULL, \`thumbnail_url\` json NULL, \`instructor_id\` varchar(255) NOT NULL, \`category_id\` varchar(255) NULL, \`status\` enum ('draft', 'published') NOT NULL DEFAULT 'draft', \`published_at\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`full_name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`preferred_locale\` enum ('ar', 'ur') NOT NULL DEFAULT 'ar', \`role\` enum ('user', 'instructor', 'admin') NOT NULL DEFAULT 'user', \`avatar_url\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`is_email_verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email_verification_tokens\` (\`id\` varchar(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_tokens\` (\`id\` varchar(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_91185d86d5d7557b19abbb2868\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`token_hash\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a7838d2ba25be1342091b6695f\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sections\` (\`id\` varchar(36) NOT NULL, \`course_id\` varchar(255) NOT NULL, \`title\` json NOT NULL, \`order\` int UNSIGNED NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lessons\` (\`id\` varchar(36) NOT NULL, \`title\` json NOT NULL, \`video_url\` json NULL, \`order\` int UNSIGNED NOT NULL DEFAULT '0', \`duration_minutes\` int UNSIGNED NOT NULL DEFAULT '0', \`is_free_preview\` tinyint NOT NULL DEFAULT 0, \`section_id\` varchar(255) NOT NULL, \`course_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courses\` (\`id\` varchar(36) NOT NULL, \`title\` json NOT NULL, \`slug\` varchar(255) NOT NULL, \`description\` json NOT NULL, \`thumbnail_url\` json NULL, \`intro_video_url\` json NULL, \`price\` json NULL, \`level\` enum ('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner', \`run_status\` enum ('ongoing', 'upcoming', 'completed') NOT NULL DEFAULT 'upcoming', \`access_type\` enum ('online_only', 'downloadable') NOT NULL DEFAULT 'online_only', \`is_published\` tinyint NOT NULL DEFAULT 0, \`discount_price\` json NULL, \`discount_expires_at\` datetime NULL, \`instructor_id\` varchar(255) NOT NULL, \`category_id\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a3bb2d01cfa0f95bc5e034e1b7\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_items\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`course_id\` varchar(255) NOT NULL, \`added_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`courseId\` varchar(36) NULL, UNIQUE INDEX \`IDX_84013478235a744889e865c0b2\` (\`user_id\`, \`course_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`coupons\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(64) NOT NULL, \`discount_type\` enum ('percentage', 'fixed') NOT NULL, \`discount_value\` int UNSIGNED NOT NULL, \`currency\` varchar(8) NULL, \`max_uses\` int UNSIGNED NULL, \`used_count\` int UNSIGNED NOT NULL DEFAULT '0', \`expires_at\` datetime NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e025109230e82925843f2a14c4\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`favorites\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`type\` enum ('course', 'article') NOT NULL, \`target_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c6406c7f3c8bff3cc0f0c0a7da\` (\`user_id\`, \`type\`, \`target_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`invoices\` (\`id\` varchar(36) NOT NULL, \`invoice_number\` varchar(255) NOT NULL, \`order_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`items\` json NOT NULL, \`subtotal\` json NOT NULL, \`discount_amount\` json NOT NULL, \`total\` json NOT NULL, \`coupon_code\` varchar(255) NULL, \`payment_ref_id\` varchar(255) NULL, \`issued_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` (\`invoice_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_reads\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`notification_id\` varchar(255) NOT NULL, \`read_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5c38c21e1fb176c9f55575cd67\` (\`user_id\`, \`notification_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` varchar(36) NOT NULL, \`title\` json NOT NULL, \`body\` json NOT NULL, \`link\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`status\` enum ('pending', 'paid', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending', \`subtotal\` json NOT NULL, \`discount_amount\` json NOT NULL, \`total\` json NOT NULL, \`coupon_id\` varchar(255) NULL, \`coupon_code\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_items\` (\`id\` varchar(36) NOT NULL, \`course_id\` varchar(255) NOT NULL, \`title_snapshot\` json NOT NULL, \`price_snapshot\` json NULL, \`orderId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` varchar(36) NOT NULL, \`order_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`amount\` json NOT NULL, \`status\` enum ('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending', \`authority\` varchar(255) NULL, \`ref_id\` varchar(255) NULL, \`gateway_url\` varchar(512) NULL, \`description\` varchar(512) NULL, \`method\` enum ('gateway', 'card_to_card') NOT NULL DEFAULT 'gateway', \`tracking_code\` varchar(64) NULL, \`source_card_number\` varchar(32) NULL, \`transferred_at\` datetime NULL, \`receipt_image_url\` varchar(512) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lesson_progress\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`lesson_id\` varchar(255) NOT NULL, \`course_id\` varchar(255) NOT NULL, \`watched_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f34e3a227170e0ce674e0afb58\` (\`user_id\`, \`lesson_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recent_views\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`type\` enum ('course', 'lesson') NOT NULL, \`target_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`viewed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_384ad8599472baf71bb6b098f3\` (\`user_id\`, \`type\`, \`target_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reviews\` (\`id\` varchar(36) NOT NULL, \`course_id\` varchar(255) NULL, \`article_id\` varchar(255) NULL, \`user_id\` varchar(255) NOT NULL, \`rating\` tinyint UNSIGNED NOT NULL, \`comment\` text NULL, \`instructor_reply\` text NULL, \`replied_at\` datetime NULL, \`is_approved\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_reviews_course_id\` (\`course_id\`), INDEX \`idx_reviews_article_id\` (\`article_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` varchar(36) NOT NULL, \`user_id\` varchar(255) NULL, \`guest_email\` varchar(255) NULL, \`subject\` varchar(255) NOT NULL, \`status\` enum ('open', 'answered', 'closed') NOT NULL DEFAULT 'open', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ticket_messages\` (\`id\` varchar(36) NOT NULL, \`ticket_id\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`author_type\` enum ('user', 'support') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories_closure\` (\`id_ancestor\` varchar(255) NOT NULL, \`id_descendant\` varchar(255) NOT NULL, INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` (\`id_ancestor\`), INDEX \`IDX_51fff5114cc41723e8ca36cf22\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_9a6f051e66982b5f0318981bcaa\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_d927e7dfef2f577745d4382c459\` FOREIGN KEY (\`instructor_id\`) REFERENCES \`instructors\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_e025eeefcdb2a269c42484ee43f\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`email_verification_tokens\` ADD CONSTRAINT \`FK_fdcb77f72f529bf65c95d72a147\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` ADD CONSTRAINT \`FK_52ac39dd8a28730c63aeb428c9c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_3ddc983c5f7bcf132fd8732c3f4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sections\` ADD CONSTRAINT \`FK_53ccbd6e2fa20dac9062f4f4c36\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lessons\` ADD CONSTRAINT \`FK_19261e484ffd22b40ea596ece4d\` FOREIGN KEY (\`section_id\`) REFERENCES \`sections\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lessons\` ADD CONSTRAINT \`FK_3c4e299cf8ed04093935e2e22fe\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_4fdc83dd6b261101401ec259342\` FOREIGN KEY (\`instructor_id\`) REFERENCES \`instructors\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courses\` ADD CONSTRAINT \`FK_e4c260fe6bb1131707c4617f745\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_d211a81109a5c8836f686faf0d6\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_items\` ADD CONSTRAINT \`FK_f1d359a55923bb45b057fbdab0d\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_f99062f36181ab42863facfaea3\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_19cc2abbefe70f6e2bbdd85229d\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_728447781a30bc3fcfe5c2f1cdf\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket_messages\` ADD CONSTRAINT \`FK_75b3a5f421dbf7b73778da519cb\` FOREIGN KEY (\`ticket_id\`) REFERENCES \`tickets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_ea1e9c4eea91160dfdb4318778d\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` ADD CONSTRAINT \`FK_51fff5114cc41723e8ca36cf227\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_51fff5114cc41723e8ca36cf227\``);
        await queryRunner.query(`ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_ea1e9c4eea91160dfdb4318778d\``);
        await queryRunner.query(`ALTER TABLE \`ticket_messages\` DROP FOREIGN KEY \`FK_75b3a5f421dbf7b73778da519cb\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_728447781a30bc3fcfe5c2f1cdf\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_19cc2abbefe70f6e2bbdd85229d\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_f99062f36181ab42863facfaea3\``);
        await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_f1d359a55923bb45b057fbdab0d\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_d211a81109a5c8836f686faf0d6\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_e4c260fe6bb1131707c4617f745\``);
        await queryRunner.query(`ALTER TABLE \`courses\` DROP FOREIGN KEY \`FK_4fdc83dd6b261101401ec259342\``);
        await queryRunner.query(`ALTER TABLE \`lessons\` DROP FOREIGN KEY \`FK_3c4e299cf8ed04093935e2e22fe\``);
        await queryRunner.query(`ALTER TABLE \`lessons\` DROP FOREIGN KEY \`FK_19261e484ffd22b40ea596ece4d\``);
        await queryRunner.query(`ALTER TABLE \`sections\` DROP FOREIGN KEY \`FK_53ccbd6e2fa20dac9062f4f4c36\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_3ddc983c5f7bcf132fd8732c3f4\``);
        await queryRunner.query(`ALTER TABLE \`password_reset_tokens\` DROP FOREIGN KEY \`FK_52ac39dd8a28730c63aeb428c9c\``);
        await queryRunner.query(`ALTER TABLE \`email_verification_tokens\` DROP FOREIGN KEY \`FK_fdcb77f72f529bf65c95d72a147\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_e025eeefcdb2a269c42484ee43f\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_d927e7dfef2f577745d4382c459\``);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_9a6f051e66982b5f0318981bcaa\``);
        await queryRunner.query(`DROP INDEX \`IDX_51fff5114cc41723e8ca36cf22\` ON \`categories_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` ON \`categories_closure\``);
        await queryRunner.query(`DROP TABLE \`categories_closure\``);
        await queryRunner.query(`DROP TABLE \`ticket_messages\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`DROP INDEX \`idx_reviews_article_id\` ON \`reviews\``);
        await queryRunner.query(`DROP INDEX \`idx_reviews_course_id\` ON \`reviews\``);
        await queryRunner.query(`DROP TABLE \`reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_384ad8599472baf71bb6b098f3\` ON \`recent_views\``);
        await queryRunner.query(`DROP TABLE \`recent_views\``);
        await queryRunner.query(`DROP INDEX \`IDX_f34e3a227170e0ce674e0afb58\` ON \`lesson_progress\``);
        await queryRunner.query(`DROP TABLE \`lesson_progress\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_5c38c21e1fb176c9f55575cd67\` ON \`notification_reads\``);
        await queryRunner.query(`DROP TABLE \`notification_reads\``);
        await queryRunner.query(`DROP INDEX \`IDX_d8f8d3788694e1b3f96c42c36f\` ON \`invoices\``);
        await queryRunner.query(`DROP TABLE \`invoices\``);
        await queryRunner.query(`DROP INDEX \`IDX_c6406c7f3c8bff3cc0f0c0a7da\` ON \`favorites\``);
        await queryRunner.query(`DROP TABLE \`favorites\``);
        await queryRunner.query(`DROP INDEX \`IDX_e025109230e82925843f2a14c4\` ON \`coupons\``);
        await queryRunner.query(`DROP TABLE \`coupons\``);
        await queryRunner.query(`DROP INDEX \`IDX_84013478235a744889e865c0b2\` ON \`cart_items\``);
        await queryRunner.query(`DROP TABLE \`cart_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3bb2d01cfa0f95bc5e034e1b7\` ON \`courses\``);
        await queryRunner.query(`DROP TABLE \`courses\``);
        await queryRunner.query(`DROP TABLE \`lessons\``);
        await queryRunner.query(`DROP TABLE \`sections\``);
        await queryRunner.query(`DROP INDEX \`IDX_a7838d2ba25be1342091b6695f\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_91185d86d5d7557b19abbb2868\` ON \`password_reset_tokens\``);
        await queryRunner.query(`DROP TABLE \`password_reset_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` ON \`email_verification_tokens\``);
        await queryRunner.query(`DROP TABLE \`email_verification_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` ON \`articles\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_1855c63bfc5515a0ef3b6ffb82\` ON \`instructors\``);
        await queryRunner.query(`DROP TABLE \`instructors\``);
    }

}
