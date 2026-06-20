import { useState, useEffect } from "react";
import type { FusionRecipeDTO } from "../models/fusion-recipe-dto";

const API_URL = import.meta.env.VITE_API_URL;

export function useFusionSearch(query: string) {
    const [results, setResults] = useState<FusionRecipeDTO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/fusions/search?material=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Failed to fetch fusion recipes", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { results, loading };
}