import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";

import jwt from "jsonwebtoken";

import UsuarioSchema from "./schemas/Usuario.js"

mongoose.connect(process.env.MONGODB_URL);

const app = express();
app.use(express.json());

const CHAVE_SECRETA = process.env.TOKEN_JWT;

app.get("/", (request, response) => {
    return response.json({ message: "Rota inicial" });
});

app.post("/registro", async (request, response) => {
    const body = request.body;

    if (!body.email) {
        return response.status(400).json({ message: "O e-mail é obrigatorio" })
    } else if (!body.nome) {
        return response.status(400).json({ message: "O nome é obrigatorio" })
    } else if (!body.senha) {
        return response.status(400).json({ message: "A senha é obrigatoria" })
    }

    const emailExists = await UsuarioSchema.findOne({ email: body.email })

    if (emailExists) {
        return response.status(400).json({ message: "Esse e-mail ja esta sendo utilizado!" })
    }

    const hash = bcrypt.hashSync(request.body.senha, 8);

    try {
        await UsuarioSchema.create({
            email: body.email,
            nome: body.nome,
            senha: hash
        })

        return response.status(201).json({
            message: "Usuario criado com sucesso!",
            token: TOKEN,
            nome: body.nome
        })
    } catch (error) {
        return response.status(500).json({
            message: "Erro ao cadastrar o usuário",
            error: error
        })
    }
});

app.post("/login", async (request, response) => {
    const body = request.body;

    try {
        if (!body.email || !body.senha) {
            return response
                .status(400)
                .json({ message: "E-mail e/ou senha são obrigatório(s)" });
        }

        const usuarioExists = await UsuarioSchema.findOne({ email: body.email });

        if (!usuarioExists) {
            return response.status(404).json({ message: "E-mail não encontrado" });
        }

        const isCorrectPassword = bcrypt.compareSync(
            body.senha,
            usuarioExists.senha
        );

        if (!isCorrectPassword) {
            return response.status(400).json({ message: "Senha inválida" });
        }

        const USER_TOKEN = jwt.sign({ id: usuarioExists._id, nome: usuarioExists.nome }, CHAVE_SECRETA)

        return response.status(200).json({
            usuario: usuarioExists.nome,
            email: usuarioExists.email,
            token: USER_TOKEN,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Erro interno: " + error,
        });
    }
});

app.listen("3333", () => { console.log("Servidor rodando...") });