import AutorSchema from "../schemas/Autor.js";

export const criarAutor = async (request, response) => {
    const body = request.body;

    if (!body.nome) {
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
};

export const listarAutores = async (request, response) => {
    try {
        const autores = await AutorSchema.find();
        return response.json(autores);
    } catch (error) {
        return response.status(500).json({ message: "Erro no servidor!" });
    }
};

export const removerAutor = async (request, response) => {
    const id = request.params.id;

    try {
        await AutorSchema.findByIdAndDelete(id);
        return response
            .status(200)
            .json({ message: "Autor removido com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
};

export const atualizarAutor = async (request, response) => {
    const id = request.params.id;
    const body = request.body;

    try {
        await AutorSchema.findByIdAndUpdate(id, { nome: body.nome });
        return response
            .status(200)
            .json({ message: "Autor atualizado com sucesso" });
    } catch (error) {
        return response.status(500).json({ message: `Erro no servidor: ${error}` });
    }
}; 