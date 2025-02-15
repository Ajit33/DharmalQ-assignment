/*
  Warnings:

  - You are about to drop the `chroma_scripts2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "chroma_scripts2";

-- CreateTable
CREATE TABLE "chroma_scripts" (
    "rowid" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,

    CONSTRAINT "chroma_scripts_pkey" PRIMARY KEY ("rowid")
);
