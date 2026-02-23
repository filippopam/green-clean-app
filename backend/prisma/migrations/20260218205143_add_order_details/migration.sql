/*
  Warnings:

  - Added the required column `scheduledDate` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "scheduledDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
ALTER COLUMN "totalAmount" SET DEFAULT 0.00;
