-- CreateEnum
CREATE TYPE "SpellType" AS ENUM ('Normal', 'Continuous', 'Equip', 'Quick-Play', 'Field', 'Ritual');

-- CreateTable
CREATE TABLE "spells" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "card_number" INTEGER,
    "type" "SpellType" NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spells_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spells_name_key" ON "spells"("name");
