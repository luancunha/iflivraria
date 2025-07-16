import express from "express";
import { criarAutor, listarAutores, removerAutor, atualizarAutor } from "../controllers/autorController.js";

const router = express.Router();

router.post("/autor", criarAutor);
router.get("/autores", listarAutores);
router.delete("/autor/:id", removerAutor);
router.put("/autor/:id", atualizarAutor);

export default router; 