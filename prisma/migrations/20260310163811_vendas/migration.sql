-- CreateTable
CREATE TABLE `Venda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('PENDENTE', 'PAGA', 'CANCELADA') NOT NULL DEFAULT 'PENDENTE',
    `total` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venda_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendaItemSubitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `venda_item_id` INTEGER NOT NULL,
    `subitem_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `desconto` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VendaItem` ADD CONSTRAINT `VendaItem_venda_id_fkey` FOREIGN KEY (`venda_id`) REFERENCES `Venda`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaItem` ADD CONSTRAINT `VendaItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaItemSubitem` ADD CONSTRAINT `VendaItemSubitem_venda_item_id_fkey` FOREIGN KEY (`venda_item_id`) REFERENCES `VendaItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendaItemSubitem` ADD CONSTRAINT `VendaItemSubitem_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
