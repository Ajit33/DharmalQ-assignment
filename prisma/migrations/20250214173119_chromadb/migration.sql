/*
  Warnings:

  - You are about to drop the `ChromaScript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ChromaScript";

-- CreateTable
CREATE TABLE "chroma_scripts2" (
    "rowid" INTEGER NOT NULL,
    "character" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,

    CONSTRAINT "chroma_scripts2_pkey" PRIMARY KEY ("rowid")
);
