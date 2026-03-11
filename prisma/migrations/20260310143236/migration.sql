-- DropForeignKey
ALTER TABLE `itemsubitem` DROP FOREIGN KEY `ItemSubitem_item_id_fkey`;

-- AddForeignKey
ALTER TABLE `ItemSubitem` ADD CONSTRAINT `ItemSubitem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
