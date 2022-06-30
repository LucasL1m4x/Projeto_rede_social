var group = require("../models/Group");
var mongoose = require("mongoose");
const { auth } = require("./UserService");
var user = require("../models/User");

const Group = mongoose.model("Group", group);
const User = mongoose.model("User", user);

class GroupService {

    async create(req, res) {
        var {id} = req.loggedUser;
        var user = await User.find({"_id": id});
        if (user[0].admin == true) {
            var { id_adm, nome, seguidores } = req.body;

            var newGroup = new Group({
                id_adm,
                nome,
                seguidores
            });
            try {
                await newGroup.save();
                res.status(200);
                res.send("Cadastro de grupo realizado!");
                return true;
            } catch {
                console.log(err);
                res.send("Algo deu errado :(")
                return false;
            }
        }else{
            res.status(401);
            res.send("Usuário não é admin");
        }


    }

    async getAll(req, res) {

        try {
            var consultas = await Group.find();
            res.json(consultas);
            return true;
        } catch {
            console.log(err);
            res.send("Consulta inválida");
            return false;
        }
    }

    async findById(req, res) {
        var id = req.params.id;
        try {
            var group = await Group.find({ '_id': id });
            res.json(group);
        } catch {
            console.log(err);
            res.send("consulta inválida");
            return false;
        }
    }

    async delete(req, res) {
        var id = req.params.id;
        try {
            await Group.deleteOne({ '_id': id });
            res.send("Grupo deletado");
        } catch {
            console.log(err);
            res.send("Não foi possível deletar o grupo");
            return false;
        }
    }

    async update(req, res) {
        var { id_adm, nome } = req.body
        var id = req.params.id;
        try {
            await Group.updateOne({ '_id': id }, { id_adm: id_adm, nome: nome });
            res.send("Grupo atualizado");
        } catch {
            console.log(err);
            res.send("Não foi possível atualizar o grupo");
            return false;
        }
    }

}

module.exports = new GroupService();
