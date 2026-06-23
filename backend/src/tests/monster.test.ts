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

    it("returns at least one monster", async () => {
        const res = await request(app).get("/monsters");
        expect(res.body.length).toBeGreaterThan(0);
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

    it("has no duplicate names", async () => {
        const res = await request(app).get("/monsters");

        const names: string[] = res.body.map((m: { name: string }) => m.name);
        const unique = new Set(names);
        expect(unique.size).toBe(names.length);
    });

    it("has no monster with a null or empty name", async () => {
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { name: unknown }) => {
            expect(typeof monster.name).toBe("string");
            expect((monster.name as string).length).toBeGreaterThan(0);
        });
    });

    it("every monster has at least one type", async () => {
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { type: unknown[] }) => {
            expect(monster.type.length).toBeGreaterThan(0);
        });
    });

    it("has non-negative ATK and DEF when present", async () => {
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { attackPoints: number | null; defensePoints: number | null }) => {
            if (monster.attackPoints !== null) expect(monster.attackPoints).toBeGreaterThanOrEqual(0);
            if (monster.defensePoints !== null) expect(monster.defensePoints).toBeGreaterThanOrEqual(0);
        });
    });

    it("has monster level between 1 and 12 when present", async () => {
        const res = await request(app).get("/monsters");

        res.body.forEach((monster: { monsterLevel: number | null }) => {
            if (monster.monsterLevel !== null) {
                expect(monster.monsterLevel).toBeGreaterThanOrEqual(1);
                expect(monster.monsterLevel).toBeLessThanOrEqual(12);
            }
        });
    });
});