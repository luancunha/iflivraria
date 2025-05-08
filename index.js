import express from "express";
import mongoose from "mongoose";

const app = express();

app.get("/", (request, response) => {
    return response.json({message: "Rota inicial"});
})

app.listen("3333", () => { console.log("Servidor rodando...") });