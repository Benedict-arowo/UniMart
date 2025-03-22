/*
  Warnings:

  - A unique constraint covering the columns `[mediaId]` on the table `Ad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "mediaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "adId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Ad_mediaId_key" ON "Ad"("mediaId");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
