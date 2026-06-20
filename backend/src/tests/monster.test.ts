import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("GET /monsters", () => {
    it("returns a 200 status", async () => {
        const res = await request(app).get("/monsters");
        expect(res.status).toBe(200);
    });

    it("returns an array", async () => {
        const res = await request(app).get("/monsters");
        expect(res.body).toBeInstanceOf(Array);
    });

    it("returns monsters sorted alphabetically by name", async () => {
        const res = await request(app).get("/monsters");

        const names: string[] = res.body.map((m: { name: string }) => m.name);
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sorted);
    });

    it("returns monsters with the expected fields", async () => {
        const res = await request(app).get("/monsters");

        const monster = res.body[0];
        expect(monster).toHaveProperty("name");
        expect(monster).toHaveProperty("attribute");
        expect(monster).toHaveProperty("monsterLevel");
        expect(monster).toHaveProperty("type");
        expect(monster).toHaveProperty("attackPoints");
        expect(monster).toHaveProperty("defensePoints");
        expect(monster).toHaveProperty("description");
        expect(monster).toHaveProperty("imageUrl");
    });

    it("returns monsters with type as an array", async () => {
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { type: unknown }) => {
            expect(monster.type).toBeInstanceOf(Array);
        });
    });

    it("returns monsters with a valid attribute", async () => {
        const validAttributes = ["DARK", "LIGHT", "WATER", "FIRE", "EARTH", "WIND", "DIVINE"];
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { attribute: string }) => {
            expect(validAttributes).toContain(monster.attribute);
        });
    });
});