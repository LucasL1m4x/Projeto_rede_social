const mongoose = require("mongoose");

const groupModel = new mongoose.Schema({

    id_adm: String,
    nome: String,
    seguidores:[
        {
            id: String
        }
    ],
});

module.exports = groupModel;
