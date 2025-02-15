-- CreateTable
CREATE TABLE "ChromaScript" (
    "id" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "user_message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "embedding" TEXT NOT NULL,

    CONSTRAINT "ChromaScript_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChromaScript_user_message_key" ON "ChromaScript"("user_message");
