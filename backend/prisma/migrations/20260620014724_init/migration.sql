-- CreateEnum
CREATE TYPE "MonsterAttribute" AS ENUM ('DARK', 'LIGHT', 'WATER', 'FIRE', 'EARTH', 'WIND', 'DIVINE');

-- CreateEnum
CREATE TYPE "MonsterType" AS ENUM ('Aqua', 'Beast', 'BeastWarrior', 'CreatorGod', 'Cyberse', 'Dinosaur', 'DivineBeast', 'Dragon', 'Fairy', 'Fiend', 'Fish', 'Insect', 'Machine', 'Plant', 'Psychic', 'Pyro', 'Reptile', 'Rock', 'SeaSerpent', 'Spellcaster', 'Thunder', 'Warrior', 'WingedBeast', 'Wyrm', 'Zombie', 'Normal', 'Effect', 'Fusion', 'Ritual', 'Synchro', 'Xyz', 'Pendulum', 'Link', 'Tuner', 'Token', 'Flip', 'Toon', 'Spirit', 'Union', 'Gemini');

-- CreateTable
CREATE TABLE "monsters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "attribute" "MonsterAttribute" NOT NULL,
    "monsterLevel" INTEGER,
    "type" "MonsterType" NOT NULL,
    "description" TEXT,
    "attackPoints" INTEGER,
    "defensePoints" INTEGER,
    "imageUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monsters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fusion_recipes" (
    "id" SERIAL NOT NULL,
    "result_monster_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fusion_recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fusion_recipe_materials" (
    "id" SERIAL NOT NULL,
    "fusion_recipe_id" INTEGER NOT NULL,
    "material_monster_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fusion_recipe_materials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fusion_recipes" ADD CONSTRAINT "fusion_recipes_result_monster_id_fkey" FOREIGN KEY ("result_monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fusion_recipe_materials" ADD CONSTRAINT "fusion_recipe_materials_fusion_recipe_id_fkey" FOREIGN KEY ("fusion_recipe_id") REFERENCES "fusion_recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fusion_recipe_materials" ADD CONSTRAINT "fusion_recipe_materials_material_monster_id_fkey" FOREIGN KEY ("material_monster_id") REFERENCES "monsters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
