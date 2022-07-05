var group = require("../models/Group");
var mongoose = require("mongoose");
const { auth } = require("./UserService");
var user = require("../models/User");

const Group = mongoose.model("Group", group);
const User = mongoose.model("User", user);

class GroupService {

    async create(req, res) {
        var { id } = req.loggedUser;
        var user = await User.find({ "_id": id });
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
            } catch (err) {
                console.log(err);
                res.send("Algo deu errado :(")
                return false;
            }
        } else {
            res.status(401);
            res.send("Usuário não é admin");
        }
    }

    async getAll(req, res) {
        try {
            var consultas = await Group.find();
            res.json(consultas);
            return true;
        } catch (err) {
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
        } catch (err) {
            console.log(err);
            res.send("consulta inválida");
            return false;
        }
    }

    async findByName(req, res) {
        var nome = req.params.nome;
        try {
            var group = await Group.find({ 'nome': nome });
            res.json(group);
        } catch (err) {
            res.send("consulta inválida");
            console.log(err);
            return false;
        }
    }

    async delete(req, res) {
        var id = req.params.id;
        try {
            await Group.deleteOne({ '_id': id });
            res.send("Grupo deletado");
        } catch (err) {
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
        } catch (err) {
            console.log(err);
            res.send("Não foi possível atualizar o grupo");
            return false;
        }
    }

    async manageMember(req, res) {
        var { id_group, id_user, action } = req.body;
        var loggedUser = await User.find({ "_id": req.loggedUser.id });
        var user = await User.find({ '_id': id_user })
        var grupo = await Group.find({ "_id": id_group });
        var membros = grupo[0].seguidores; 
        var grupos = user[0].grupos;
        var msg = ''; 

        if (loggedUser[0].admin == true) {
            try {
                if(action == 'add'){
                    if (membros.length > 0) {
                        var membro = membros.find(m => m._id == id_user);
                        if(membro != undefined) {
                            msg = "O usuário já é membro do grupo!"; 
                        } else {
                            membros.push({ '_id': id_user })
                            grupos.push({ '_id': id_group })
                            msg = "Usuário adicionado ao grupo!";
                        }
                    } else {
                        membros.push({ '_id': id_user })
                        grupos.push({ '_id': id_group })
                        msg = "Usuário adicionado ao grupo!";
                    }
                } else {
                    if(membros.length > 0){
                        var membro = membros.find(m => m._id == id_user)
                        if(membro != undefined) {
                            membros.splice(membros.findIndex(m => m._id == id_user), 1);
                            grupos.splice(grupos.findIndex(g => g._id == id_group), 1);
                            msg = "Usuário removido do grupo!";
                        } else {
                            msg = "Usuário não faz parte do grupo!";
                        }
                    } else {
                        msg = "O grupo não possui nenhum membro!";
                    }
                }
                await Group.updateOne({'_id': id_group}, {seguidores: membros});
                await User.updateOne({'_id': id_user}, {grupos: grupos});
                res.send(msg);
            } catch (err) {
                res.status(404);
                res.send(`Não foi possivel cumprir a ação. Erro: ${err} `);
            }
        } else {
            res.status(401);
            res.send("O usuário não é administrador");
        }

    }

}

module.exports = new GroupService();
