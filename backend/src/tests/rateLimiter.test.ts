import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import request from "supertest";
import { apiKeyAuth } from "../middleware/apiKeyAuth";
import { rateLimiter } from "../middleware/rateLimiter";

const TEST_API_KEY = "test-api-key";

const testApp = express();
// Mirrors app.ts: trust one reverse-proxy hop so rate limits key off the real client IP
// (from X-Forwarded-For) instead of the proxy's own IP.
testApp.set("trust proxy", 1);
testApp.use(apiKeyAuth);
testApp.use(rateLimiter);
testApp.get("/ping", (_req, res) => res.json({ ok: true }));

describe("rate limiting", () => {
    const originalApiKey = process.env.API_KEY;

    beforeAll(() => {
        process.env.API_KEY = TEST_API_KEY;
    });

    afterAll(() => {
        process.env.API_KEY = originalApiKey;
    });

    it("applies rate-limit headers to a request with no API key", async () => {
        const res = await request(testApp).get("/ping");

        expect(res.status).toBe(200);
        expect(res.headers["ratelimit-limit"]).toBeDefined();
    });

    it("applies rate-limit headers to a request with an invalid API key", async () => {
        const res = await request(testApp).get("/ping").set("X-API-Key", "wrong-key");

        expect(res.status).toBe(200);
        expect(res.headers["ratelimit-limit"]).toBeDefined();
    });

    it("omits rate-limit headers for a request with a valid API key", async () => {
        const res = await request(testApp).get("/ping").set("X-API-Key", TEST_API_KEY);

        expect(res.status).toBe(200);
        expect(res.headers["ratelimit-limit"]).toBeUndefined();
    });

    it("keys the rate limit by the forwarded client IP, not the connecting proxy", async () => {
        // Both requests arrive from the same supertest connection (the "proxy" hop), but
        // carry different X-Forwarded-For values. With trust proxy configured, each
        // forwarded IP should get its own independent bucket rather than sharing one.
        const resA = await request(testApp).get("/ping").set("X-Forwarded-For", "1.2.3.4");
        const resB = await request(testApp).get("/ping").set("X-Forwarded-For", "5.6.7.8");

        expect(Number(resA.headers["ratelimit-remaining"])).toBe(Number(resB.headers["ratelimit-remaining"]));
    });

    it("blocks unauthenticated requests once the limit is exceeded, but a trusted client is unaffected", async () => {
        let lastStatus = 200;

        // A handful of requests were already made by earlier tests in this file against
        // the same in-memory store; send comfortably more than the 100-request limit to
        // guarantee it trips regardless of that prior count.
        for (let i = 0; i < 110; i++) {
            const res = await request(testApp).get("/ping");
            lastStatus = res.status;
        }

        expect(lastStatus).toBe(429);

        const trustedRes = await request(testApp).get("/ping").set("X-API-Key", TEST_API_KEY);
        expect(trustedRes.status).toBe(200);
    });
});