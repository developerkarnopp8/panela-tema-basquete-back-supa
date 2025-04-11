/*
  Warnings:

  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
