/*
  Warnings:

  - You are about to drop the column `categoriId` on the `Post` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scheduled" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryName" TEXT,
    "authorId" TEXT,
    CONSTRAINT "Post_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("authorId", "content", "createdAt", "id", "published", "scheduled", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "id", "published", "scheduled", "title", "updatedAt" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
