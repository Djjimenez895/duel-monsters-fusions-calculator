import { NextFunction, Request, Response } from "express";

export function apiKeyAuth(req: Request, _res: Response, next: NextFunction) {
    const providedKey = req.header("X-API-Key");
    const expectedKey = process.env.API_KEY;

    req.isTrustedClient = Boolean(expectedKey) && providedKey === expectedKey;
    next();
}