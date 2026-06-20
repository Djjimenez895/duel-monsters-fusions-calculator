import "dotenv/config";
import express from "express";
import monsterRouter from "./routes/monsterRoute";
import fusionRecipeRouter from "./routes/fusionRecipeRoute";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "Duel Monsters Fusion API is running." });
});

app.use("/monsters", monsterRouter);
app.use("/fusions", fusionRecipeRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});