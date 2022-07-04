var mongoose = require("mongoose");
const logSessaoModel = require("../models/LogSessao");

const LogSessao = mongoose.model("LogSessao", logSessaoModel);

class LogSessaoService {

    async createLog(id, req, res) {

        var data = new Date();
        var dia = String(data.getDate()).padStart(2, '0');
        var mes = String(data.getMonth() + 1).padStart(2, '0');
        var ano = data.getFullYear();
        var dataAtual = dia + '/' + mes + '/' + ano;
        var newLog = new LogSessao({ id_user: id, tipo: "Entrou", data: dataAtual });
        await newLog.save();

    }

    async numSessao(req, res) {
        var { id_user, data } = req.body
        var logs = await LogSessao.find({ "id_user": id_user });
        var numEntrada;
        var lista = [
            {
                numEntrada
            }
        ];
        var dataReq = data.split("/");
        var rdiaInt = parseInt(dataReq[0]);
        var rmesInt = parseInt(dataReq[1]);
        var ranoInt = parseInt(dataReq[2]);

        logs.forEach(async log => {
            var dataBanco = log.data.split("/");
            var bdiaInt = parseInt(dataBanco[0]);
            var bmesInt = parseInt(dataBanco[1]);
            var banoInt = parseInt(dataBanco[2]);
            

            if (rdiaInt == bdiaInt && rmesInt == bmesInt && ranoInt == banoInt) {
                lista.push({ log });
                numEntrada = logs.length;
            }else{
                numEntrada = 0;
            }
        });
        lista.push(numEntrada);
        res.json(lista);
    }

}
module.exports = new LogSessaoService();