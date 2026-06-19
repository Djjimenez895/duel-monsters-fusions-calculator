import './SearchPage.css'
import { useState } from "react";
import type { Monster } from "../../models/monster";
import { MonsterAttribute } from '../../models/monster-attributes';
import { MonsterType } from '../../models/monster-type';
import type { MonsterFusion } from '../../models/monster-fusion';
import mysticalElfImg from "../../assets/MysticalElfImage.png";


// These const Monsters are temporary. 
// There will be a backend for storing this information. 
// These const simply exist for experimenting with the UI. 
const wingEggElf: Monster = {
    name: "Wing Egg Elf",
    attribute: MonsterAttribute.Light,
    monsterLevel: 3,
    type: [MonsterType.Fairy, MonsterType.Normal],
    description: "This fairy in an eggshell uses massive wings to blow back almost any projectile attack.",
    attackPoints: 500,
    defensePoints: 1300
};

const luckyTrinket: Monster = {
    name: "Lucky Trinket",
    attribute: MonsterAttribute.Light,
    monsterLevel: 2,
    type: [MonsterType.Spellcaster, MonsterType.Normal],
    description: "This creature may look slim and weak, but it's protected by a mystical force.",
    attackPoints: 600,
    defensePoints: 800
};

const mysticalElf: Monster = {
    name: "Mystical Elf",
    attribute: MonsterAttribute.Light,
    monsterLevel: 4,
    type: [MonsterType.Spellcaster, MonsterType.Normal],
    description: "A delicate elf that lacks offense, but has a terrific defense backed by mystical power.",
    attackPoints: 600,
    defensePoints: 800,
    imageUrl: mysticalElfImg,
};

const mysticalElfFusion: MonsterFusion = {
    fusionMonsterMaterials: [wingEggElf, luckyTrinket],
    fusionResult: mysticalElf
};

const fusionData = [
    mysticalElfFusion,
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const filtered = fusionData.filter((fusion) =>
        fusion.fusionMonsterMaterials.some((material) =>
            material.name.toLowerCase().startsWith(query.toLowerCase())
        )
    );

    return (
        <div className="search-page">
            <div className="search-hero">
                <h1 className="search-title">Fusion Calculator</h1>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Enter a monster name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            {query && (
                <div className="search-results">
                    <table className="card-table">
                        <thead>
                            <tr>
                                <th>Material 1</th>
                                <th>Material 2</th>
                                <th>Fusion Monster</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, index) => (
                                <>
                                    <tr onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                                        <td>{row.fusionMonsterMaterials[0].name}</td>
                                        <td>{row.fusionMonsterMaterials[1].name}</td>
                                        <td>
                                            {row.fusionResult.name}
                                            <span className="expand-btn">
                                                {expandedRow === index ? "▼" : "▶"}
                                            </span>
                                        </td>
                                    </tr>
                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan={3}>
                                                <div className="expanded-details">
                                                    {row.fusionResult.imageUrl && (
                                                        <img
                                                            src={row.fusionResult.imageUrl}
                                                            alt={row.fusionResult.name}
                                                            onError={(e) => e.currentTarget.style.display = "none"}
                                                        />
                                                    )}
                                                    <div> Monster Name: {row.fusionResult.name} </div>
                                                    <div>ATK: {row.fusionResult.attackPoints} | DEF: {row.fusionResult.defensePoints} </div>
                                                    <div>Description: {row.fusionResult.description} </div>
                                                </div>

                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}