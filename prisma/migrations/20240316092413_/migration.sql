-- CreateTable
CREATE TABLE "Pets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Pets_pkey" PRIMARY KEY ("id")
);
