/*
  Warnings:

  - You are about to drop the column `replyIdTwitter` on the `likes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_replyIdTwitter_fkey";

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "replyIdTwitter",
ADD COLUMN     "replyId" UUID;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "reply"("id_reply") ON DELETE SET NULL ON UPDATE CASCADE;
