const mongoose = require("mongoose");

const logSessaoModel = new mongoose.Schema({

    id_user: String,
    tipo: String,
    data: String

});

module.exports = logSessaoModel;