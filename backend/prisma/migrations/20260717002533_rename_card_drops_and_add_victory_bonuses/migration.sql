/*
  Warnings:

  - You are about to drop the `card_drops` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "card_drops" DROP CONSTRAINT "card_drops_monster_id_fkey";

-- DropTable
DROP TABLE "card_drops";

-- CreateTable
CREATE TABLE "monster_card_drops" (
    "id" SERIAL NOT NULL,
    "duelist_name" "Duelist" NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "drop_chance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monster_card_drops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monster_victory_bonuses" (
    "id" SERIAL NOT NULL,
    "duelist_name" "Duelist" NOT NULL,
    "monster_id" INTEGER NOT NULL,
    "wins_required" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monster_victory_bonuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "monster_card_drops" ADD CONSTRAINT "monster_card_drops_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monster_victory_bonuses" ADD CONSTRAINT "monster_victory_bonuses_monster_id_fkey" FOREIGN KEY ("monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
