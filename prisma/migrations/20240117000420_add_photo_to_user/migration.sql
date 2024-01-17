/*
  Warnings:

  - Made the column `twitterOrigin` on table `reply` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reply" DROP CONSTRAINT "reply_twitterOrigin_fkey";

-- AlterTable
ALTER TABLE "reply" ALTER COLUMN "twitterOrigin" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "photo" VARCHAR(100);

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_twitterOrigin_fkey" FOREIGN KEY ("twitterOrigin") REFERENCES "twitter"("id_twitter") ON DELETE RESTRICT ON UPDATE CASCADE;
