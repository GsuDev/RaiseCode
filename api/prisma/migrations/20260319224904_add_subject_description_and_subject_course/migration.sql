-- AlterTable
ALTER TABLE `Subject` ADD COLUMN `description` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `SubjectCourse` (
    `subjectId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,

    PRIMARY KEY (`subjectId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubjectCourse` ADD CONSTRAINT `SubjectCourse_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectCourse` ADD CONSTRAINT `SubjectCourse_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
