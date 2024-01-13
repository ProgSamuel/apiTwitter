/*
  Warnings:

  - You are about to drop the column `twitterId` on the `reply` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_twitterId_fkey";

-- AlterTable
ALTER TABLE "reply" DROP COLUMN "twitterId",
ADD COLUMN     "twitterOrigin" UUID;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_twitterOrigin_fkey" FOREIGN KEY ("twitterOrigin") REFERENCES "twitter"("id_twitter") ON DELETE SET NULL ON UPDATE CASCADE;
