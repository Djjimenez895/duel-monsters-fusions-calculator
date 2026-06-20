import './SearchPage.css'
import { useState } from "react";
import { useFusionSearch } from "../../hooks/useFusionSearch";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const { results, loading } = useFusionSearch(query);

    return (
        <div className="search-page">
            <div className="search-hero">
                <h1 className="search-title">Fusion Calculator</h1>
                <input
                    className="search-input"
                    type="text"
                    placeholder="Enter a monster name..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setExpandedRow(null);
                    }}
                />
            </div>
            {query && (
                <div className="search-results">
                    {loading ? (
                        <p>Loading...</p>
                    ) : results.length === 0 ? (
                        <p>No fusion recipes found.</p>
                    ) : (
                        <table className="card-table">
                            <thead>
                                <tr>
                                    <th>Material 1</th>
                                    <th>Material 2</th>
                                    <th>Fusion Monster</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <>
                                        <tr onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                                            <td>{row.materials[0]?.name}</td>
                                            <td>{row.materials[1]?.name}</td>
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
                                                        <div>Monster Name: {row.fusionResult.name}</div>
                                                        <div>ATK: {row.fusionResult.attackPoints} | DEF: {row.fusionResult.defensePoints}</div>
                                                        <div>Description: {row.fusionResult.description}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}