/*
  Warnings:

  - A unique constraint covering the columns `[playerId,teamId]` on the table `PlayerTeam` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlayerTeam_playerId_teamId_key" ON "PlayerTeam"("playerId", "teamId");
