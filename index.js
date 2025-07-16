import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import autorRoutes from "./routes/autorRoutes.js";
import livroRoutes from "./routes/livroRoutes.js";

mongoose.connect(process.env.MONGODB_URL);

const app = express();
app.use(express.json());

const CHAVE_SECRETA = process.env.TOKEN_JWT;

app.get("/", (request, response) => {
    return response.json({ message: "Rota inicial" });
});

app.use(usuarioRoutes);
app.use(autorRoutes);
app.use(livroRoutes);

app.listen("3333", () => { console.log("Servidor rodando...") });