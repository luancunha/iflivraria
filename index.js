import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";

import jwtVerify from "./services/jwt-verify.js";

import jwt from "jsonwebtoken";

import UsuarioSchema from "./schemas/Usuario.js";
import AutorSchema from "./schemas/Autor.js";
import LivroSchema from "./schemas/Livro.js";

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

app.get("/teste", jwtVerify, (request, response) => {
    return response.json({ message: "Rota teste" });
});

app.post("/autor", async (request, response) => {
    const body = request.body;

    if (body.nome) {
        return response.status(400).json({ message: "O nome é obrigatório" });
    }

    try {
        const autorCreated = await AutorSchema.create({
            nome: body.nome,
        });

        return response.status(201).json(autorCreated);
    } catch (error) {
        return response.status(500).json({ message: "Erro no servidor!" });
    }
});

app.get("/autores", async (request, response) => {
    try {
        const autores = await AutorSchema.find();

        return response.json(autores);
    } catch (error) {
        return response.status(500).json({ message: "Erro no servidor!" });
    }
});

app.delete("/autor/:id", async (request, response) => {
    const id = request.params.id;

    try {
        await AutorSchema.findByIdAndDelete(id);
        return response
            .status(200)
            .json({ message: "Autor removido com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

app.put("/autor/:id", async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    try {
        await AutorSchema.findByIdAndUpdate(id, { name: body.name });
        return response
            .status(200)
            .json({ message: "Autor atualizado com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

app.post("/livro", async (request, response) => {
    const body = request.body;

    try {
        const autorExists = await AutorSchema.findById(
            body.autor
        );

        if (!autorExists) {
            return response
                .status(404)
                .json({ message: "Autor nao encontrado." });
        }

        await LivroSchema.create({
            titulo: body.titulo,
            resumo: body.resumo,
            autor: body.autor,
            url: body.url,
        });

        return response.status(201).json({ message: "Livro criado com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

app.get("/livro", async (request, response) => {
    try {
        const books = await LivroSchema.find().populate("autor");
        return response.json(books);
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

app.get("/livro/:id", async (request, response) => {
    const id = request.params.id;

    try {
        const livros = await LivroSchema.find(id).populate("autor");

        return response.json(livros);
    } catch (error) {
        return response.status(500).json({ message: 'Erro no servidor!" ${error}' });
    }
});

app.put("/livro/:id", async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    if (!validarId(body.autor)) {
        return response.status(400).json({ message: "ID Inválido." });
    }

    try {
        const autorExists = await AutorSchema.findById(
            body.autor
        );

        if (!autorExists) {
            return response
                .status(404)
                .json({ message: "Autor nao encontrado." });
        }

        await LivroSchema.findByIdAndUpdate(id, {
            titulo: body.titulo,
            resumo: body.resumo,
            autor: body.autor,
            url: body.url,
        });
        return response
            .status(200)
            .json({ message: "Livro atualizado com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

app.delete("/livro/:id", async (request, response) => {
    const id = request.params.id;

    if (!validarId(body.autor)) {
        return response.status(400).json({ message: "ID Inválido." });
    }

    try {
        const livroExists = await LivroSchema.findById(id);
        if (!livroExists) {
            return response.status(404).json({ message: "Livro inexistente" });
        }

        await LivroSchema.findByIdAndDelete(id);
        return response
            .status(200)
            .json({ message: "Livro removido com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
});

function validarId(id) {
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
}

app.listen("3333", () => { console.log("Servidor rodando...") });