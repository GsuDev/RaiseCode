/*
  Warnings:

  - You are about to drop the column `code` on the `CompletedChallenges` table. All the data in the column will be lost.
  - Added the required column `Code` to the `CompletedChallenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CompletedChallenges` DROP COLUMN `code`,
    ADD COLUMN `Code` VARCHAR(1500) NOT NULL;
