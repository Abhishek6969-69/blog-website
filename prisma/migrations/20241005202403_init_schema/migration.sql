/*
  Warnings:

  - You are about to drop the column `descrption` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "descrption",
ALTER COLUMN "published" DROP NOT NULL;
