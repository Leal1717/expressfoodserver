/*
  Warnings:

  - Added the required column `tipo` to the `ItemSubitem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `itemsubitem` ADD COLUMN `tipo` ENUM('MATERIA_PRIMA', 'ADICIONAL', 'AMBOS') NOT NULL;
