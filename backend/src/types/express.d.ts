import "express";

declare global {
    namespace Express {
        interface Request {
            isTrustedClient?: boolean;
        }
    }
}