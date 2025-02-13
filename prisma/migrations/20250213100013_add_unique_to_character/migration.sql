/*
  Warnings:

  - You are about to drop the column `movieId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Dialogue` table. All the data in the column will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_message]` on the table `Dialogue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `response` to the `Dialogue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_message` to the `Dialogue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_movieId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "movieId";

-- AlterTable
ALTER TABLE "Dialogue" DROP COLUMN "text",
ADD COLUMN     "response" TEXT NOT NULL,
ADD COLUMN     "user_message" TEXT NOT NULL;

-- DropTable
DROP TABLE "Movie";

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dialogue_user_message_key" ON "Dialogue"("user_message");
