const mongoose = require("mongoose");

const userModel = new mongoose.Schema({

    nome: String,
    departamento: String,
    cargo: String,
    email: String,
    data_nascimento: String,
    telefone: String,
    admin: Boolean,
    foto: String,
    senha: String,
    seguindo:[
        {
            id: String
        }
    ],
    seguidores:[
        {
            id: String
        }
    ],
    grupos:[
        {
            id: String
        }
    ]

});

module.exports = userModel;
