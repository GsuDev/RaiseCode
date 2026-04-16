/*
  Warnings:

  - Added the required column `description` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Achievement` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `xpReward` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `xp` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `UserAchievements` ADD COLUMN `unlockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
