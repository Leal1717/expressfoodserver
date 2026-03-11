-- DropForeignKey
ALTER TABLE `comboitem` DROP FOREIGN KEY `ComboItem_combo_id_fkey`;

-- AddForeignKey
ALTER TABLE `ComboItem` ADD CONSTRAINT `ComboItem_combo_id_fkey` FOREIGN KEY (`combo_id`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
