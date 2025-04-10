/*
  Warnings:

  - A unique constraint covering the columns `[storeId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "storeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_storeId_key" ON "Media"("storeId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
