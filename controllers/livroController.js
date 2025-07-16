import LivroSchema from "../schemas/Livro.js";
import AutorSchema from "../schemas/Autor.js";

function validarId(id) {
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(id);
}

export const criarLivro = async (request, response) => {
    const body = request.body;
    try {
        const autorExists = await AutorSchema.findById(body.autor);
        if (!autorExists) {
            return response.status(404).json({ message: "Autor nao encontrado." });
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
};

export const listarLivros = async (request, response) => {
    try {
        const books = await LivroSchema.find().populate("autor");
        return response.json(books);
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
};

export const buscarLivroPorId = async (request, response) => {
    const id = request.params.id;
    try {
        const livro = await LivroSchema.findById(id).populate("autor");
        if (!livro) {
            return response.status(404).json({ message: "Livro não encontrado" });
        }
        return response.json(livro);
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
};

export const atualizarLivro = async (request, response) => {
    const id = request.params.id;
    const body = request.body;
    if (!validarId(body.autor)) {
        return response.status(400).json({ message: "ID Inválido." });
    }
    try {
        const autorExists = await AutorSchema.findById(body.autor);
        if (!autorExists) {
            return response.status(404).json({ message: "Autor nao encontrado." });
        }
        await LivroSchema.findByIdAndUpdate(id, {
            titulo: body.titulo,
            resumo: body.resumo,
            autor: body.autor,
            url: body.url,
        });
        return response.status(200).json({ message: "Livro atualizado com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
};

export const removerLivro = async (request, response) => {
    const id = request.params.id;
    try {
        const livroExists = await LivroSchema.findById(id);
        if (!livroExists) {
            return response.status(404).json({ message: "Livro inexistente" });
        }
        await LivroSchema.findByIdAndDelete(id);
        return response.status(200).json({ message: "Livro removido com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
}; 