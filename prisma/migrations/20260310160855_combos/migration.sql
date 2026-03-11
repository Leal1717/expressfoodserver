-- AlterTable
ALTER TABLE `item` MODIFY `tipo` ENUM('PRODUTO', 'MERCADORIA', 'COMBO') NOT NULL DEFAULT 'MERCADORIA';

-- CreateTable
CREATE TABLE `ComboItem` (
    `combo_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `quantidade` DECIMAL(10, 3) NOT NULL,

    PRIMARY KEY (`combo_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_combo_id_fkey` FOREIGN KEY (`combo_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
