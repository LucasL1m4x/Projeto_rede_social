var mongoose = require("mongoose");
const logSessaoModel = require("../models/LogSessao");

const LogSessao = mongoose.model("LogSessao", logSessaoModel);

class LogSessaoService {

    async create(id, req, res) {
        var id_user = id;
        var log = await LogSessao.find({ "id_user": id_user });

        if (log != undefined) {
            var logs = await LogSessao.find();
            for (let index = 0; index < logs.length; index++) {
                var logId = log[index].id;
                var entrada = await LogSessao.find({ "_id": logId }, { numEntrada: 1 });

                var entradaInt = parseInt(entrada[0].numEntrada);
                if (log[index].id_user == log[index].id_user) {
                    entradaInt = entradaInt + 1;
                    await LogSessao.updateOne({ "_id": logId }, { numEntrada: entradaInt.toString() });
                }

            }
        }else{
            var newLog = new LogSessao({
                id_user,
                tipo : "Entrou",
                data : Date(),
                numEntrada: "0"
            });
            await newLog.save();
        }
    }

    async numSessao(req, res) {
        try {
            var logs = await LogSessao.find();
        } catch (err) {
            console.log(err);
            res.send("Algo deu errado :(")
            return false;
        }
        res.json(logs);
    }

}
module.exports = new LogSessaoService();