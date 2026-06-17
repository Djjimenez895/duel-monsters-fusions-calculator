import './SearchPage.css'
import { useState } from "react";

const fusionData = [
    { material1: "Wing Egg Elf", material2: "Lucky Trinket", fusionMonster: "Mystical Elf" },
    { material1: "Air Marmot of Nefa", material2: "Skull Servant", fusionMonster: "Shadow Specter" },
    { material1: "Fiend Sword", material2: "Baby Dragon", fusionMonster: "Sword Arm of Drago" },
]

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const filtered = fusionData.filter((row) =>
        row.material1.toLowerCase().startsWith(query.toLowerCase()) ||
        row.material2.toLowerCase().startsWith(query.toLowerCase())
    );


    return (
        <div className="search-page">
            <div className="search-hero">
                <h1 className="search-title">Fusion Calculator</h1>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search cards..."
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
                            {filtered.map((row) => (
                                <tr key={row.material1}>
                                    <td>{row.material1}</td>
                                    <td>{row.material2}</td>
                                    <td>{row.fusionMonster}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}