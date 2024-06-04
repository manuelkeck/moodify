/*
  Warnings:

  - Added the required column `lastUpdate` to the `Moods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Moods" ADD COLUMN     "lastUpdate" TIMESTAMP(3) NOT NULL;
