-- CreateTable
CREATE TABLE "Moods" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "auth0Sub" TEXT NOT NULL,
    "prevMood" TEXT NOT NULL,
    "currentMood" TEXT NOT NULL,

    CONSTRAINT "Moods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moods_auth0Sub_key" ON "Moods"("auth0Sub");
