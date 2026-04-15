-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "targetMonth" TEXT;
