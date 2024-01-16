/*
  Warnings:

  - Added the required column `idFollowing` to the `followers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "followers" ADD COLUMN     "idFollowing" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_idFollowing_fkey" FOREIGN KEY ("idFollowing") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
