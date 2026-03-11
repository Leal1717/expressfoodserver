/*
  Warnings:

  - You are about to drop the `materiaprima` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produtomateriaprima` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `materiaprima` DROP FOREIGN KEY `MateriaPrima_classe_id_fkey`;

-- DropForeignKey
ALTER TABLE `materiaprima` DROP FOREIGN KEY `MateriaPrima_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `Produto_classe_id_fkey`;

-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `Produto_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `produtomateriaprima` DROP FOREIGN KEY `ProdutoMateriaPrima_materia_prima_id_fkey`;

-- DropForeignKey
ALTER TABLE `produtomateriaprima` DROP FOREIGN KEY `ProdutoMateriaPrima_produto_id_fkey`;

-- DropTable
DROP TABLE `materiaprima`;

-- DropTable
DROP TABLE `produto`;

-- DropTable
DROP TABLE `produtomateriaprima`;

-- CreateTable
CREATE TABLE `Subitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `empresa_id` INTEGER NOT NULL,

    INDEX `Subitem_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `codigo_barras` VARCHAR(191) NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `tipo` ENUM('PRODUTO', 'MERCADORIA') NOT NULL DEFAULT 'MERCADORIA',
    `empresa_id` INTEGER NOT NULL,
    `classe_id` INTEGER NULL,

    INDEX `Item_empresa_id_idx`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemSubitem` (
    `item_id` INTEGER NOT NULL,
    `subitem_id` INTEGER NOT NULL,
    `tipo` ENUM('MATERIA_PRIMA', 'ADICIONAL', 'AMBOS') NOT NULL DEFAULT 'MATERIA_PRIMA',
    `quantidade` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`item_id`, `subitem_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subitem` ADD CONSTRAINT `Subitem_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `Empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_classe_id_fkey` FOREIGN KEY (`classe_id`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemSubitem` ADD CONSTRAINT `ItemSubitem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemSubitem` ADD CONSTRAINT `ItemSubitem_subitem_id_fkey` FOREIGN KEY (`subitem_id`) REFERENCES `Subitem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
