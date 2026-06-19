import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Duel Monsters Fusion API is running." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});