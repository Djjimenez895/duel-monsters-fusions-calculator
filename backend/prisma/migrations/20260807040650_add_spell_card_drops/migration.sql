-- CreateTable
CREATE TABLE "spell_card_drops" (
    "id" SERIAL NOT NULL,
    "duelist_name" "Duelist" NOT NULL,
    "spell_id" INTEGER NOT NULL,
    "drop_chance" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spell_card_drops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spell_victory_bonuses" (
    "id" SERIAL NOT NULL,
    "duelist_name" "Duelist" NOT NULL,
    "spell_id" INTEGER NOT NULL,
    "wins_required" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spell_victory_bonuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spell_card_drops" ADD CONSTRAINT "spell_card_drops_spell_id_fkey" FOREIGN KEY ("spell_id") REFERENCES "spells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spell_victory_bonuses" ADD CONSTRAINT "spell_victory_bonuses_spell_id_fkey" FOREIGN KEY ("spell_id") REFERENCES "spells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
