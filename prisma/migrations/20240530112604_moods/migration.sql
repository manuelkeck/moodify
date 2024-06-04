/*
  Warnings:

  - Changed the type of `lastUpdate` on the `Moods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Moods" DROP COLUMN "lastUpdate",
ADD COLUMN     "lastUpdate" TIMESTAMP(3) NOT NULL;
