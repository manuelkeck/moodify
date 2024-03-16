-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "currentMood" TEXT NOT NULL,
    "targetMood" TEXT NOT NULL,
    "recURL" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);
