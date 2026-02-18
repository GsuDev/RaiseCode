/*
  Warnings:

  - Added the required column `cycle` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `cycle` ENUM('DAW', 'DAM', 'ASIR') NOT NULL;
