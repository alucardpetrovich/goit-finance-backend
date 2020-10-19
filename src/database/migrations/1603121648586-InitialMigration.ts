import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1603121648586 implements MigrationInterface {
    name = 'InitialMigration1603121648586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "familyId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "families" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalSalary" integer NOT NULL, "passiveIncome" integer NOT NULL, "incomePercentageToSavings" integer NOT NULL, "balance" integer NOT NULL, "flatPrice" integer NOT NULL, "flatSquareMeters" integer NOT NULL, "giftsUnpacked" integer NOT NULL DEFAULT 0, "giftsForUnpacking" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_70414ac0c8f45664cf71324b9bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "familyId" uuid, CONSTRAINT "PK_bbd38b9174546b0ed4fe04689c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" double precision NOT NULL, "transactionDate" date NOT NULL, "type" character varying NOT NULL DEFAULT 'EXPENSE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mainCategoryId" uuid, "subCategoryId" uuid, "familyId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fe061246f26eb287a16b0fa300d" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" ADD CONSTRAINT "FK_2d56e3544db2da27e0075de0c61" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_75fb36f01b4936db6f3160c2786" FOREIGN KEY ("mainCategoryId") REFERENCES "transaction_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7ce2accdc43b1bbced75a5b222b" FOREIGN KEY ("subCategoryId") REFERENCES "transaction_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_3017626fb64f1f8fcfc479b380e" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_3017626fb64f1f8fcfc479b380e"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7ce2accdc43b1bbced75a5b222b"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_75fb36f01b4936db6f3160c2786"`);
        await queryRunner.query(`ALTER TABLE "transaction_categories" DROP CONSTRAINT "FK_2d56e3544db2da27e0075de0c61"`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_57de40bc620f456c7311aa3a1e6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fe061246f26eb287a16b0fa300d"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "transaction_categories"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "families"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
