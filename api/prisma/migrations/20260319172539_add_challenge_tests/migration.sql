-- CreateTable
CREATE TABLE `ChallengeTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `challengeId` INTEGER NOT NULL,
    `input` TEXT NOT NULL,
    `expectedOutput` TEXT NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengeTest` ADD CONSTRAINT `ChallengeTest_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenge`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
