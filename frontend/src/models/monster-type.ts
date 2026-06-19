
/** All possible monster types in Yu-Gi-Oh! */
export const MonsterType = {
    // Monster types
    Aqua: "Aqua",
    Beast: "Beast",
    BeastWarrior: "Beast-Warrior",
    CreatorGod: "Creator God",
    Cyberse: "Cyberse",
    Dinosaur: "Dinosaur",
    DivineBeast: "Divine-Beast",
    Dragon: "Dragon",
    Fairy: "Fairy",
    Fiend: "Fiend",
    Fish: "Fish",
    Insect: "Insect",
    Machine: "Machine",
    Plant: "Plant",
    Psychic: "Psychic",
    Pyro: "Pyro",
    Reptile: "Reptile",
    Rock: "Rock",
    SeaSerpent: "Sea Serpent",
    Spellcaster: "Spellcaster",
    Thunder: "Thunder",
    Warrior: "Warrior",
    WingedBeast: "Winged Beast",
    Wyrm: "Wyrm",
    Zombie: "Zombie",

    // Card classification types
    Normal: "Normal",
    Effect: "Effect",
    Fusion: "Fusion",
    Ritual: "Ritual",
    Synchro: "Synchro",
    Xyz: "Xyz",
    Pendulum: "Pendulum",
    Link: "Link",
    Tuner: "Tuner",
    Token: "Token",
    Flip: "Flip",
    Toon: "Toon",
    Spirit: "Spirit",
    Union: "Union",
    Gemini: "Gemini",
} as const;

export type MonsterType = typeof MonsterType[keyof typeof MonsterType];
