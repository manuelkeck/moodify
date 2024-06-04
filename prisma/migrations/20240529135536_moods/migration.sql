/*
  Warnings:

  - The primary key for the `Moods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Moods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Moods" DROP CONSTRAINT "Moods_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Moods_pkey" PRIMARY KEY ("auth0Sub");
