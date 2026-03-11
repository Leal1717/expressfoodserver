-- DropForeignKey
ALTER TABLE `comboitem` DROP FOREIGN KEY `ComboItem_item_id_fkey`;

-- DropIndex
DROP INDEX `ComboItem_item_id_fkey` ON `comboitem`;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
