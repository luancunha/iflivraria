import { Schema, model } from "mongoose";

const livroModel = new Schema({
  titulo: { type: String, required: true },

  resumo: { type: String, required: true },

  autor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Autor",
  },

  url: { type: String, required: true },
});

export default model("Livro", livroModel);