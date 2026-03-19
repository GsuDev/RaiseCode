/*
  Warnings:
  - You are about to drop the column `cycle` on the `User` table.
  - Added the required column `courseId` to the `User` table without a default value.
*/

-- Crear la tabla Course
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Course_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertar los registros base de los ciclos
INSERT INTO `Course` (`id`, `name`) VALUES (1, 'DAW'), (2, 'DAM'), (3, 'ASIR');

-- Añadir la columna courseId a User 
ALTER TABLE `User` ADD COLUMN `courseId` INTEGER;

-- Migrar los datos de la columna 'cycle' a la nueva columna 'courseId'
UPDATE `User` SET `courseId` = 1 WHERE `cycle` = 'DAW';
UPDATE `User` SET `courseId` = 2 WHERE `cycle` = 'DAM';
UPDATE `User` SET `courseId` = 3 WHERE `cycle` = 'ASIR';

-- Si algún usuario no tenía un ciclo válido, le asignamos DAW (id 1) por defecto para que no falle el NOT NULL
UPDATE `User` SET `courseId` = 1 WHERE `courseId` IS NULL;

-- Eliminar la columna antigua 'cycle' y el ENUM no es necesario en MySQL ya que Prisma lo gestiona como Check o simplemente desaparece de la definición
ALTER TABLE `User` DROP COLUMN `cycle`;

-- Poner la columna courseId como NOT NULL y añadir la Foreign Key
ALTER TABLE `User` MODIFY `courseId` INTEGER NOT NULL;
ALTER TABLE `User` ADD CONSTRAINT `User_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
