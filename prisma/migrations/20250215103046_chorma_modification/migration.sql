/*
  Warnings:

  - The primary key for the `chroma_scripts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rowid` on the `chroma_scripts` table. All the data in the column will be lost.
  - The `embedding` column on the `chroma_scripts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "chroma_scripts" DROP CONSTRAINT "chroma_scripts_pkey",
DROP COLUMN "rowid",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "embedding",
ADD COLUMN     "embedding" DECIMAL(65,30)[],
ADD CONSTRAINT "chroma_scripts_pkey" PRIMARY KEY ("id");
