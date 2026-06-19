import type { Monster } from "./monster";

/** Represents a monster fusion "recipe" and the resulting monster stats. 
 *  The fusion referred to in this interface is the behavior in games such as 
 *  Duel Monsters on Game Boy and Yu-Gi-Oh! Forbidden Memories. This is not to be 
 *  confused with the actual fusion summoning mechanic that was introduced later in the card game. 
*/
export interface MonsterFusion { 
    /** Monsters needed to create the fusionResult. Since a fusion in any version of duel monsters
     *  requires at least two monsters, this array requires two monsters, but also allows for more 
     *  so this interface can be used for future Duel Monsters game where fusions with more than
     *  two monsters exist. 
     */
    fusionMonsterMaterials: [Monster, Monster, ...Monster[]];

    /** The monster produced by the fusion */
    fusionResult: Monster;
}