/*
  Warnings:

  - You are about to drop the column `eventId` on the `Checkin` table. All the data in the column will be lost.
  - You are about to drop the column `endDateTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,eventInstanceId]` on the table `Checkin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventInstanceId` to the `Checkin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_eventId_fkey";

-- DropIndex
DROP INDEX "Checkin_userId_eventId_key";

-- AlterTable
ALTER TABLE "Checkin" DROP COLUMN "eventId",
ADD COLUMN     "eventInstanceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endDateTime",
DROP COLUMN "startDateTime";

-- CreateTable
CREATE TABLE "EventInstance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventInstanceId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "rebounds" INTEGER NOT NULL DEFAULT 0,
    "blocks" INTEGER NOT NULL DEFAULT 0,
    "steals" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerStats_userId_eventInstanceId_key" ON "PlayerStats"("userId", "eventInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Checkin_userId_eventInstanceId_key" ON "Checkin"("userId", "eventInstanceId");

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerStats" ADD CONSTRAINT "PlayerStats_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
