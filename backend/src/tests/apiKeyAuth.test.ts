import { describe, it, expect, vi, afterEach } from "vitest";
import type { Request, Response } from "express";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

function createRequest(headerValue?: string): Request {
    return {
        header: (name: string) => (name === "X-API-Key" ? headerValue : undefined),
    } as unknown as Request;
}

describe("apiKeyAuth", () => {
    const originalApiKey = process.env.API_KEY;

    afterEach(() => {
        process.env.API_KEY = originalApiKey;
    });

    it("trusts a request whose X-API-Key header matches API_KEY", () => {
        process.env.API_KEY = "secret";
        const req = createRequest("secret");
        const next = vi.fn();

        apiKeyAuth(req, {} as Response, next);

        expect(req.isTrustedClient).toBe(true);
        expect(next).toHaveBeenCalledOnce();
    });

    it("does not trust a request with a missing header", () => {
        process.env.API_KEY = "secret";
        const req = createRequest(undefined);
        const next = vi.fn();

        apiKeyAuth(req, {} as Response, next);

        expect(req.isTrustedClient).toBe(false);
        expect(next).toHaveBeenCalledOnce();
    });

    it("does not trust a request with a header that doesn't match API_KEY", () => {
        process.env.API_KEY = "secret";
        const req = createRequest("wrong-key");
        const next = vi.fn();

        apiKeyAuth(req, {} as Response, next);

        expect(req.isTrustedClient).toBe(false);
    });

    it("does not trust a missing header when API_KEY is also unset", () => {
        // Without the explicit "API_KEY is configured" check, `undefined === undefined`
        // would evaluate to true here and incorrectly trust every client.
        delete process.env.API_KEY;
        const req = createRequest(undefined);
        const next = vi.fn();

        apiKeyAuth(req, {} as Response, next);

        expect(req.isTrustedClient).toBe(false);
    });

    it("never rejects the request itself, even without a valid key", () => {
        process.env.API_KEY = "secret";
        const req = createRequest(undefined);
        const res = { status: vi.fn(), json: vi.fn() } as unknown as Response;
        const next = vi.fn();

        apiKeyAuth(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledOnce();
    });
});
