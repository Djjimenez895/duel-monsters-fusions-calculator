import "dotenv/config";
import express from "express";
import cors from "cors";
import monsterRouter from "./routes/monsterRoute";
import fusionRecipeRouter from "./routes/fusionRecipeRoute";

export const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
    : ["http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
}));
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "Duel Monsters Fusion API is running." });
});

app.use("/monsters", monsterRouter);
app.use("/fusions", fusionRecipeRouter);