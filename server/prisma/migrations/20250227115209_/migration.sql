/*
  Warnings:

  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WishlistProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `active` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistProducts" DROP CONSTRAINT "_WishlistProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_WishlistProducts" DROP CONSTRAINT "_WishlistProducts_B_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "Wishlist";

-- DropTable
DROP TABLE "_WishlistProducts";
