import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMonthReportEntity1606599771690 implements MigrationInterface {
    name = 'AddMonthReportEntity1606599771690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_75fb36f01b4936db6f3160c2786"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_7ce2accdc43b1bbced75a5b222b"`);
        await queryRunner.query(`CREATE TABLE "month-reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalExpenses" double precision NOT NULL, "totalSavings" double precision NOT NULL, "totalIncome" double precision NOT NULL, "expectedSavingsPercentage" double precision NOT NULL, "expectedSavings" double precision NOT NULL, "reportDate" date NOT NULL DEFAULT CURRENT_DATE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "familyId" uuid, CONSTRAINT "PK_22c2e3ffa408c1f45c558838c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "mainCategoryId"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "subCategoryId"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "comment" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "transactionDate" SET DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "month-reports" ADD CONSTRAINT "FK_2ec0ae0b62a47bf1c9a4b7d91fd" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64" FOREIGN KEY ("categoryId") REFERENCES "transaction_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_86e965e74f9cc66149cf6c90f64"`);
        await queryRunner.query(`ALTER TABLE "month-reports" DROP CONSTRAINT "FK_2ec0ae0b62a47bf1c9a4b7d91fd"`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "transactionDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "subCategoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "mainCategoryId" uuid`);
        await queryRunner.query(`DROP TABLE "month-reports"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_7ce2accdc43b1bbced75a5b222b" FOREIGN KEY ("subCategoryId") REFERENCES "transaction_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_75fb36f01b4936db6f3160c2786" FOREIGN KEY ("mainCategoryId") REFERENCES "transaction_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
