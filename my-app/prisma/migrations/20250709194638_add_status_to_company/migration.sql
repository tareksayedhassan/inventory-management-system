/*
  Warnings:

  - You are about to drop the column `active` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `com_code` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `system_nums` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updaeted_by_id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Company` table. All the data in the column will be lost.
  - Added the required column `company_code` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Company` DROP FOREIGN KEY `Company_updaeted_by_id_fkey`;

-- DropIndex
DROP INDEX `Company_updaeted_by_id_fkey` ON `Company`;

-- AlterTable
ALTER TABLE `Company` DROP COLUMN `active`,
    DROP COLUMN `com_code`,
    DROP COLUMN `created_at`,
    DROP COLUMN `system_nums`,
    DROP COLUMN `updaeted_by_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `company_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updated_by_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `password` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_updated_by_id_fkey` FOREIGN KEY (`updated_by_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
