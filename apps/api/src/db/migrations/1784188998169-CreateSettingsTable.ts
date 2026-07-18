import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettingsTable1784188998169 implements MigrationInterface {
    name = 'CreateSettingsTable1784188998169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`settings\` (\`key\` varchar(100) NOT NULL, \`value\` text NOT NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`settings\``);
    }

}
