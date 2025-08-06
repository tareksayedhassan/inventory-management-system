-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `avatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('neutral', 'creditBalance', 'debitBalance') NULL,
    `phone` VARCHAR(191) NOT NULL,
    `tax_number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `Campname` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `added_by_id` INTEGER NULL,
    `updated_by_id` INTEGER NULL,

    INDEX `Supplier_added_by_id_fkey`(`added_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditBalance` DOUBLE NULL,
    `debitBalance` DOUBLE NULL,
    `treasuryId` INTEGER NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eznEdafaId` INTEGER NULL,
    `userId` INTEGER NULL,
    `supplierId` INTEGER NOT NULL,

    INDEX `SupplierTransaction_treasuryId_idx`(`treasuryId`),
    INDEX `SupplierTransaction_eznEdafaId_idx`(`eznEdafaId`),
    INDEX `SupplierTransaction_userId_idx`(`userId`),
    INDEX `SupplierTransaction_supplierId_idx`(`supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('neutral', 'creditBalance', 'debitBalance') NULL,
    `phone` VARCHAR(191) NOT NULL,
    `tax_number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `Campname` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `added_by_id` INTEGER NULL,
    `updated_by_id` INTEGER NULL,

    INDEX `Client_added_by_id_fkey`(`added_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditBalance` DOUBLE NULL,
    `debitBalance` DOUBLE NULL,
    `treasuryId` INTEGER NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `eznEdafaId` INTEGER NULL,
    `userId` INTEGER NULL,
    `ClientId` INTEGER NOT NULL,

    INDEX `ClientTransaction_treasuryId_idx`(`treasuryId`),
    INDEX `ClientTransaction_eznEdafaId_idx`(`eznEdafaId`),
    INDEX `ClientTransaction_userId_idx`(`userId`),
    INDEX `ClientTransaction_ClientId_idx`(`ClientId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treasury` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `added_by_id` INTEGER NULL,

    INDEX `Treasury_added_by_id_fkey`(`added_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreasuryTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Tahseel_mn_3ameel', 'Sadad_le_moored', 'Eda3_mobasher', 'Sa7b_mobasher') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('cash', 'check', 'transfer') NOT NULL,
    `description` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `treasuryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,
    `clientId` INTEGER NULL,
    `supplierId` INTEGER NULL,

    INDEX `TreasuryTransaction_treasuryId_idx`(`treasuryId`),
    INDEX `TreasuryTransaction_userId_idx`(`userId`),
    INDEX `TreasuryTransaction_clientId_idx`(`clientId`),
    INDEX `TreasuryTransaction_supplierId_idx`(`supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,
    `treasuryId` INTEGER NULL,
    `transactionId` INTEGER NULL,
    `treasuryTransactionId` INTEGER NULL,
    `redirectUrl` VARCHAR(191) NULL,

    INDEX `Notification_userId_idx`(`userId`),
    INDEX `Notification_treasuryId_idx`(`treasuryId`),
    INDEX `Notification_transactionId_idx`(`transactionId`),
    INDEX `Notification_treasuryTransactionId_idx`(`treasuryTransactionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productCode` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `lastBuyPrice` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `added_by_id` INTEGER NULL,
    `updated_by_id` INTEGER NULL,

    INDEX `Product_added_by_id_fkey`(`added_by_id`),
    INDEX `Product_updated_by_id_fkey`(`updated_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productCode` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `lastBuyPrice` DOUBLE NULL,
    `quantity` INTEGER NOT NULL,
    `total` DOUBLE NULL,
    `type` VARCHAR(191) NOT NULL,
    `redirctURL` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `supplierId` INTEGER NULL,
    `ClientId` INTEGER NULL,
    `added_by_id` INTEGER NULL,
    `StockId` INTEGER NULL,
    `StockWithoutTaxId` INTEGER NULL,
    `eznEdafaProductId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EznEdafaProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eznEdafaId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `itemTotal` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EznEdafa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalAmount` DOUBLE NOT NULL,
    `tax` DOUBLE NULL DEFAULT 0,
    `supplierId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `stockId` INTEGER NULL,
    `StockWithoutTaxID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `productId` INTEGER NULL,

    INDEX `EznEdafa_supplierId_idx`(`supplierId`),
    INDEX `EznEdafa_userId_idx`(`userId`),
    INDEX `EznEdafa_stockId_idx`(`stockId`),
    INDEX `EznEdafa_StockWithoutTaxID_idx`(`StockWithoutTaxID`),
    INDEX `EznEdafa_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `productCode` VARCHAR(191) NULL,
    `stockTax` INTEGER NOT NULL,
    `totalStock` INTEGER NOT NULL,
    `totalValue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockWithoutTax` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `productCode` VARCHAR(191) NULL,
    `totalStock` INTEGER NOT NULL,
    `totalValue` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_added_by_id_fkey` FOREIGN KEY (`added_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_updated_by_id_fkey` FOREIGN KEY (`updated_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierTransaction` ADD CONSTRAINT `SupplierTransaction_treasuryId_fkey` FOREIGN KEY (`treasuryId`) REFERENCES `Treasury`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierTransaction` ADD CONSTRAINT `SupplierTransaction_eznEdafaId_fkey` FOREIGN KEY (`eznEdafaId`) REFERENCES `EznEdafa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierTransaction` ADD CONSTRAINT `SupplierTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierTransaction` ADD CONSTRAINT `SupplierTransaction_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_added_by_id_fkey` FOREIGN KEY (`added_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_updated_by_id_fkey` FOREIGN KEY (`updated_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientTransaction` ADD CONSTRAINT `ClientTransaction_treasuryId_fkey` FOREIGN KEY (`treasuryId`) REFERENCES `Treasury`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientTransaction` ADD CONSTRAINT `ClientTransaction_eznEdafaId_fkey` FOREIGN KEY (`eznEdafaId`) REFERENCES `EznEdafa`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientTransaction` ADD CONSTRAINT `ClientTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientTransaction` ADD CONSTRAINT `ClientTransaction_ClientId_fkey` FOREIGN KEY (`ClientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treasury` ADD CONSTRAINT `Treasury_added_by_id_fkey` FOREIGN KEY (`added_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryTransaction` ADD CONSTRAINT `TreasuryTransaction_treasuryId_fkey` FOREIGN KEY (`treasuryId`) REFERENCES `Treasury`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryTransaction` ADD CONSTRAINT `TreasuryTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryTransaction` ADD CONSTRAINT `TreasuryTransaction_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreasuryTransaction` ADD CONSTRAINT `TreasuryTransaction_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_treasuryId_fkey` FOREIGN KEY (`treasuryId`) REFERENCES `Treasury`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_treasuryTransactionId_fkey` FOREIGN KEY (`treasuryTransactionId`) REFERENCES `TreasuryTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_added_by_id_fkey` FOREIGN KEY (`added_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_updated_by_id_fkey` FOREIGN KEY (`updated_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_ClientId_fkey` FOREIGN KEY (`ClientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_added_by_id_fkey` FOREIGN KEY (`added_by_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_StockId_fkey` FOREIGN KEY (`StockId`) REFERENCES `Stock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_StockWithoutTaxId_fkey` FOREIGN KEY (`StockWithoutTaxId`) REFERENCES `StockWithoutTax`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductTransaction` ADD CONSTRAINT `ProductTransaction_eznEdafaProductId_fkey` FOREIGN KEY (`eznEdafaProductId`) REFERENCES `EznEdafaProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafaProduct` ADD CONSTRAINT `EznEdafaProduct_eznEdafaId_fkey` FOREIGN KEY (`eznEdafaId`) REFERENCES `EznEdafa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafaProduct` ADD CONSTRAINT `EznEdafaProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafa` ADD CONSTRAINT `EznEdafa_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafa` ADD CONSTRAINT `EznEdafa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafa` ADD CONSTRAINT `EznEdafa_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `Stock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EznEdafa` ADD CONSTRAINT `EznEdafa_StockWithoutTaxID_fkey` FOREIGN KEY (`StockWithoutTaxID`) REFERENCES `StockWithoutTax`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
