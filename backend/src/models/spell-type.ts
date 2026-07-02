/* The different spell types for Duel Monsters cards. */
export const SpellType = { 
    Normal: "Normal",
    Continuous: "Continuous",
    Equip: "Equip",
    QuickPlay: "Quick-Play",
    Field: "Field",
    Ritual: "Ritual",
} as const;

export type SpellType = typeof SpellType[keyof typeof SpellType];