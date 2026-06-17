import './SearchPage.css'
import { useState } from "react";

const fusionData = [
    { name: "Blue-Eyes White Dragon", type: "Dragon" },
    { name: "Dark Magician", type: "Spellcaster" },
    { name: "Blue-Eyes Ultimate Dragon", type: "Dragon" },
];

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const filtered = fusionData.filter((row) =>
        row.name.toLowerCase().includes(query.toLowerCase())
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
                <th>Name</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}