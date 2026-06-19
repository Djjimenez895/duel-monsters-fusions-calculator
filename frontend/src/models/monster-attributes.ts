/** All possible monster attributes in Yu-Gi-Oh! */
export const MonsterAttribute = {
    Dark: "DARK",
    Light: "LIGHT",
    Water: "WATER",
    Fire: "FIRE",
    Earth: "EARTH",
    Wind: "WIND",
    Divine: "DIVINE",
} as const;

export type MonsterAttribute = typeof MonsterAttribute[keyof typeof MonsterAttribute];
