-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storeId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discountedPrice" DROP NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT false,
ALTER COLUMN "storeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
