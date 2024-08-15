/*
  Warnings:

  - You are about to drop the column `zip_code` on the `User` table. All the data in the column will be lost.
  - Added the required column `zipCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "zip_code",
ADD COLUMN     "zipCode" TEXT NOT NULL;
