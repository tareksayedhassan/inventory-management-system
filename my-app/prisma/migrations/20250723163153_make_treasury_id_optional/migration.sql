-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_treasuryId_fkey`;

-- AlterTable
ALTER TABLE `Notification` MODIFY `treasuryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_treasuryId_fkey` FOREIGN KEY (`treasuryId`) REFERENCES `Treasury`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
