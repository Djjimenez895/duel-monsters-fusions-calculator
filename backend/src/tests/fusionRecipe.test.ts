import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("GET /fusions/search", () => {
    it("returns fusion recipes when searching by a valid material name", async () => {
        const res = await request(app)
            .get("/fusions/search?material=Gaia the Fierce Knight");

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("returns the correct fusion result for Gaia the Fierce Knight", async () => {
        const res = await request(app)
            .get("/fusions/search?material=Gaia the Fierce Knight");

        expect(res.status).toBe(200);
        const recipe = res.body[0];
        expect(recipe.fusionResult.name).toBe("Gaia the Dragon Champion");
    });

    it("includes all materials in the recipe", async () => {
        const res = await request(app)
            .get("/fusions/search?material=Gaia the Fierce Knight");

        const recipe = res.body[0];
        const materialNames = recipe.materials.map((m: { name: string }) => m.name);
        expect(materialNames).toContain("Gaia the Fierce Knight");
        expect(materialNames).toContain("Curse of Dragon");
    });

    it("does not include id, createdAt, or updatedAt in the response", async () => {
        const res = await request(app)
            .get("/fusions/search?material=Gaia the Fierce Knight");

        const recipe = res.body[0];
        expect(recipe.fusionResult).not.toHaveProperty("id");
        expect(recipe.fusionResult).not.toHaveProperty("createdAt");
        expect(recipe.fusionResult).not.toHaveProperty("updatedAt");
        recipe.materials.forEach((m: object) => {
            expect(m).not.toHaveProperty("id");
            expect(m).not.toHaveProperty("createdAt");
            expect(m).not.toHaveProperty("updatedAt");
        });
    });

    it("returns 400 when material query param is missing", async () => {
        const res = await request(app).get("/fusions/search");
        expect(res.status).toBe(400);
    });

    it("returns an empty array when no recipes match", async () => {
        const res = await request(app)
            .get("/fusions/search?material=NonExistentMonster");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("is case insensitive", async () => {
        const res = await request(app)
            .get("/fusions/search?material=gaia the fierce knight");

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it("matches by prefix, not substring", async () => {
        const prefixRes = await request(app)
            .get("/fusions/search?material=Gaia");

        expect(prefixRes.status).toBe(200);
        expect(prefixRes.body.length).toBeGreaterThan(0);

        // "fierce" appears mid-name but is not a prefix — should return nothing
        const midStringRes = await request(app)
            .get("/fusions/search?material=fierce");

        expect(midStringRes.status).toBe(200);
        expect(midStringRes.body).toEqual([]);
    });
});