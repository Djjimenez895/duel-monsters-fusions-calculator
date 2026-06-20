-- =============================================
-- Yu-Gi-Oh! Duel Monsters (Game Boy) Seed Data
-- NOTE: Verify stats against Yugipedia before
-- using in production.
-- =============================================

-- =============================================
-- MONSTERS
-- =============================================
INSERT INTO cards.monsters (name, attribute, "monsterLevel", type, description, "attackPoints", "defensePoints", "imageUrl", created_at, updated_at)
VALUES
-- Normal Monsters
('Blue-Eyes White Dragon',          'LIGHT', 8,  ARRAY['Dragon', 'Normal']::cards."MonsterType"[],        'This legendary dragon is a powerful engine of destruction. Virtually invincible, very few have faced this awesome creature and lived to tell the tale.', 3000, 2500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dark Magician',                   'DARK',  7,  ARRAY['Spellcaster', 'Normal']::cards."MonsterType"[],   'The ultimate wizard in terms of attack and defense.', 2500, 2100, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Summoned Skull',                  'DARK',  6,  ARRAY['Fiend', 'Normal']::cards."MonsterType"[],         'A fiend with dark powers for confusing the enemy. Among the Fiend-Type monsters, this monster boasts considerable force.', 2500, 1200, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Red-Eyes Black Dragon',           'DARK',  7,  ARRAY['Dragon', 'Normal']::cards."MonsterType"[],        'A ferocious dragon with a deadly attack.', 2400, 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gaia the Fierce Knight',          'EARTH', 7,  ARRAY['Warrior', 'Normal']::cards."MonsterType"[],       'A knight whose horse travels faster than the wind. His battle charge is a force to be reckoned with.', 2300, 2100, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Curse of Dragon',                 'DARK',  5,  ARRAY['Dragon', 'Normal']::cards."MonsterType"[],        'A wicked dragon that calls on dark forces to execute a powerful attack.', 2000, 1500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Celtic Guardian',                 'EARTH', 4,  ARRAY['Warrior', 'Normal']::cards."MonsterType"[],       'An elf who learned to use a sword, he is a master of fighting techniques.', 1400, 1200, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Mystical Elf',                    'LIGHT', 4,  ARRAY['Spellcaster', 'Normal']::cards."MonsterType"[],   'A delicate elf that lacks offense, but has a terrific defense backed by mystical power.', 800, 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Flame Manipulator',               'FIRE',  3,  ARRAY['Spellcaster', 'Normal']::cards."MonsterType"[],   'This Spellcaster throws fireballs and casts fire-related spells.', 900, 1000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Masaki the Legendary Swordsman',  'EARTH', 4,  ARRAY['Warrior', 'Normal']::cards."MonsterType"[],       'One of the few remaining heroes of the original duel monster wars.', 1100, 1100, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Baby Dragon',                     'WIND',  3,  ARRAY['Dragon', 'Normal']::cards."MonsterType"[],        'Much more than just a child, this dragon is gifted with untapped power.', 1200, 700,  NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Beaver Warrior',                  'EARTH', 4,  ARRAY['BeastWarrior', 'Normal']::cards."MonsterType"[],  'What this creature lacks in size it makes up for in defense when battling in the prairie.', 1200, 1500, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Giant Soldier of Stone',          'EARTH', 3,  ARRAY['Rock', 'Normal']::cards."MonsterType"[],          'A giant warrior made of stone. A punch from this creature has earth-shaking results.', 1300, 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Harpie Lady',                     'WIND',  4,  ARRAY['WingedBeast', 'Normal']::cards."MonsterType"[],   'This human-like creature with wings of a bird is beautiful but deadly.', 1300, 1400, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Time Wizard',                     'LIGHT', 2,  ARRAY['Spellcaster', 'Effect']::cards."MonsterType"[],   'With a roll of the Time Roulette, either the opponent''s monsters are destroyed or this card''s monsters are destroyed.', 500, 400, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Fusion Monsters
('Blue-Eyes Ultimate Dragon',       'LIGHT', 12, ARRAY['Dragon', 'Fusion']::cards."MonsterType"[],        'The ultimate dragon. This fearsome creature boasts three heads, each as deadly as the next.', 4500, 3800, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Gaia the Dragon Champion',        'WIND',  7,  ARRAY['Dragon', 'Fusion']::cards."MonsterType"[],        'Gaia the Fierce Knight merged with Curse of Dragon, creating the ultimate cavalry soldier.', 2600, 2100, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Flame Swordsman',                 'FIRE',  5,  ARRAY['Warrior', 'Fusion']::cards."MonsterType"[],       'A fusion of Masaki the Legendary Swordsman and Flame Manipulator. A warrior expert in the magic of fire.', 1800, 1600, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thousand Dragon',                 'WIND',  7,  ARRAY['Dragon', 'Fusion']::cards."MonsterType"[],        'A dragon that has gained incredible power after being evolved by the Time Wizard.', 2400, 2000, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- =============================================
-- FUSION RECIPES
-- =============================================

-- Blue-Eyes Ultimate Dragon (Blue-Eyes White Dragon x3)
INSERT INTO cards.fusion_recipes (result_monster_id, created_at, updated_at)
VALUES ((SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes Ultimate Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cards.fusion_recipe_materials (fusion_recipe_id, material_monster_id, created_at, updated_at)
VALUES
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes Ultimate Dragon')), (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes White Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes Ultimate Dragon')), (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes White Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes Ultimate Dragon')), (SELECT id FROM cards.monsters WHERE name = 'Blue-Eyes White Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Gaia the Dragon Champion (Gaia the Fierce Knight + Curse of Dragon)
INSERT INTO cards.fusion_recipes (result_monster_id, created_at, updated_at)
VALUES ((SELECT id FROM cards.monsters WHERE name = 'Gaia the Dragon Champion'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cards.fusion_recipe_materials (fusion_recipe_id, material_monster_id, created_at, updated_at)
VALUES
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Gaia the Dragon Champion')), (SELECT id FROM cards.monsters WHERE name = 'Gaia the Fierce Knight'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Gaia the Dragon Champion')), (SELECT id FROM cards.monsters WHERE name = 'Curse of Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Flame Swordsman (Flame Manipulator + Masaki the Legendary Swordsman)
INSERT INTO cards.fusion_recipes (result_monster_id, created_at, updated_at)
VALUES ((SELECT id FROM cards.monsters WHERE name = 'Flame Swordsman'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cards.fusion_recipe_materials (fusion_recipe_id, material_monster_id, created_at, updated_at)
VALUES
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Flame Swordsman')), (SELECT id FROM cards.monsters WHERE name = 'Flame Manipulator'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Flame Swordsman')), (SELECT id FROM cards.monsters WHERE name = 'Masaki the Legendary Swordsman'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Thousand Dragon (Baby Dragon + Time Wizard)
INSERT INTO cards.fusion_recipes (result_monster_id, created_at, updated_at)
VALUES ((SELECT id FROM cards.monsters WHERE name = 'Thousand Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cards.fusion_recipe_materials (fusion_recipe_id, material_monster_id, created_at, updated_at)
VALUES
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Thousand Dragon')), (SELECT id FROM cards.monsters WHERE name = 'Baby Dragon'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
((SELECT id FROM cards.fusion_recipes WHERE result_monster_id = (SELECT id FROM cards.monsters WHERE name = 'Thousand Dragon')), (SELECT id FROM cards.monsters WHERE name = 'Time Wizard'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);