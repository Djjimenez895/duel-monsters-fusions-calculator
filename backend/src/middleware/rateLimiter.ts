import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 100;

export const rateLimiter = rateLimit({
    windowMs: WINDOW_MS,
    limit: MAX_REQUESTS_PER_WINDOW,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.isTrustedClient === true,
    message: { message: "Too many requests. Please try again later." },
});