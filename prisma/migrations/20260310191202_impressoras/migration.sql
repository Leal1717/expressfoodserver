-- CreateTable
CREATE TABLE `Impressora` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Impressora_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Impressora` ADD CONSTRAINT `Impressora_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
