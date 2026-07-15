import { useState, useEffect } from "react";
import type { FusionRecipeDTO } from "../models/fusion-recipe-dto";

const API_URL = import.meta.env.VITE_API_URL;

export function useFusionSearch(query: string) {
    const [results, setResults] = useState<FusionRecipeDTO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/fusions/search?material=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);

                // Preload all card images in the background so they're cached by the time
                // the user clicks to expand a row.
                for (const recipe of data) {
                    for (const monster of [...recipe.materials, recipe.fusionResult]) {
                        if (monster?.imageUrl) {
                            const img = new Image();
                            img.src = monster.imageUrl;
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch fusion recipes", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { results: query ? results : [], loading };
}