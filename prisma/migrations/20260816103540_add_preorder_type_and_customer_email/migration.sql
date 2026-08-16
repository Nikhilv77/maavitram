-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('standard', 'preorder');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'standard';

-- CreateIndex
CREATE INDEX "Order_orderType_status_createdAt_idx" ON "Order"("orderType", "status", "createdAt");
