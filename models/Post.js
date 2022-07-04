const mongoose = require("mongoose");

const postModel = new mongoose.Schema({

    id_user: String,
    tema: String,
    descricao: String,
    fotoPublicacao: String,
    curtidaDetalhe:[
        {
            id: String
        }
    ],
    comentarios:[
        {
            idUser: String,
            texto: String
        }
    ],
    data: String,
    interacoesDoTema: String

});

module.exports = postModel;