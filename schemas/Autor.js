import {Schema, model} from "mongoose"

const autorModel = new Schema({
    name:{
        type:String,
        required:true
    },
})

export default model("Autor", autorModel)