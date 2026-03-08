-- AlterTable
ALTER TABLE "genre" ADD COLUMN "tmdbId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "movie" ADD COLUMN "tmdbId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "genre_tmdbId_key" ON "genre"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "movie_tmdbId_key" ON "movie"("tmdbId");
