/*
  Warnings:

  - You are about to drop the column `addressId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ServiceZone` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `number` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupDate` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('SCHEDULED', 'PICKED_UP', 'IN_PROCESS', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayMethod" AS ENUM ('ONLINE', 'CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "PayStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceZone" DROP CONSTRAINT "ServiceZone_routeId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "addressId",
DROP COLUMN "scheduledDate",
ADD COLUMN     "discountApplied" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "finalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "paymentMethod" "PayMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
ADD COLUMN     "paymentStatus" "PayStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ADD COLUMN     "pickupDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "totalAmount" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "description" TEXT,
ADD COLUMN     "zipCodes" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE "ServiceZone";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "minAmount" DECIMAL(65,30),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
