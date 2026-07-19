-- CreateEnum
CREATE TYPE "Duelist" AS ENUM ('Yugi Muto', 'Tristan Taylor', 'Joey Wheeler', 'Ryou Bakura', 'Weevil Underwood', 'Mako Tsunami', 'Seto Kaiba', 'Mokuba Kaiba', 'Puppeteer', 'PaniK', 'Bandit Keith', 'Simon Muran', 'Maximillion Pegasus', 'Yami Yugi');

-- CreateTable
CREATE TABLE "card_drops" (
    "id" SERIAL NOT NULL,
    "duelist_name" "Duelist" NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "drop_chance" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_drops_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "card_drops" ADD CONSTRAINT "card_drops_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
