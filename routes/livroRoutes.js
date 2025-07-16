import express from "express";
import { criarLivro, listarLivros, buscarLivroPorId, atualizarLivro, removerLivro } from "../controllers/livroController.js";

const router = express.Router();

router.post("/livro", criarLivro);
router.get("/livro", listarLivros);
router.get("/livro/:id", buscarLivroPorId);
router.put("/livro/:id", atualizarLivro);
router.delete("/livro/:id", removerLivro);

export default router; 