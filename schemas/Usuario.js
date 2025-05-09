import {Schema, model} from "mongoose"

const usuarioModel = new Schema({
    nome:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    senha:{
        type:String,
        required:true
    }
})

export default model("Usuario", usuarioModel)