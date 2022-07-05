var user = require("../models/User");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");
const { createLog } = require("./LogSessaoService");
const JWTSecret = "Starwars";

const User = mongoose.model("User", user);

class UserService {

    async create(req, res) {
        var { nome, departamento, cargo, email, data_nascimento,
            telefone, admin, foto, senha, seguindo, seguidores, grupos } = req.body;

        var newUser = new User({
            nome,
            departamento,
            cargo, email,
            data_nascimento,
            telefone,
            admin,
            foto,
            senha,
            seguindo,
            seguidores,
            grupos
        });
        try {
            var users = await User.find();
            users.forEach(u => {
                if (u.email == newUser.email) {
                    res.status(401);
                    res.send('E-mail já cadastrado no sistema!');
                    return false;
                }
            })
            await newUser.save();
            res.status(200);
            res.send("Cadastro de usuário realizado!");
            return true;
        } catch (err) {
            console.log(err);
            res.send("Algo deu errado :(")
            return false;
        }

    }

    async getAll(req, res) {
        try {
            var consultas = await User.find();
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
            var user = await User.find({ '_id': id });
            res.json(user);
        } catch (err) {
            res.send("consulta inválida");
            console.log(err);
            return false;
        }
    }

    async findByName(req, res) {
        var nome = req.params.nome;
        try {
            var user = await User.find({ nome: {$regex: nome, $options:'i'} });
            res.json(user);
        } catch (err) {
            res.send("consulta inválida");
            console.log(err);
            return false;
        }
    }


    async delete(req, res) {
        var id = req.params.id;
        try {
            await User.deleteOne({ '_id': id });
            res.send("Usuário deletado");
        } catch (err) {
            console.log(err);
            res.send("Não foi possível deletar o usuário");
            return false;
        }
    }

    async update(req, res) {
        var { nome, departamento, cargo, email, data_nascimento,
            telefone, admin, foto, senha } = req.body
        var id = req.params.id;
        try {
            await User.updateOne({ '_id': id }, {
                nome: nome, departamento: departamento, cargo: cargo,
                email: email, data_nascimento: data_nascimento, telefone: telefone, admin: admin, foto: foto, senha: senha
            });
            res.send("Usuário atualizado");
        } catch (err) {
            console.log(err);
            res.send("Não foi possível atualizar o usuário");
            return false;
        }
    }

    async token(req, res) {
        // Swagger 
        // #swagger.tags = ["users"]

        // #swagger.summary = "autenticação de usuário"

        // #swagger.description = "Rota responsável por autenticar um usuário na Rede Social."

        // #swagger.operationId = "UserAuth"
        /*
            #swagger.parameters['input'] = {
                in: 'body',
                description: 'E-mail e senha do usuário.',
                required: true,
                schema: {
                    $email: 'timoteo@lob.com',
                    $senha: 4124241
                }
            }
        */

        var { email, senha } = req.body;
        var user = await User.find({ email: email });
        var userId = user[0].id;

        if (user != undefined) {
            if (user[0].email == email) {
                if (user[0].senha == senha) {
                    try {
                        var token = jwt.sign({ id: userId, email: user[0].email }, JWTSecret, { expiresIn: '48h' });
                        res.status(200);
                        res.json({ token: token });
                        createLog(userId);
                    } catch (err) {
                        res.status(400);
                        res.json("Falha interna");
                    }
                } else {
                    res.status(401);
                    res.send("Senha incorreta");
                }
            } else {
                res.status(401);
                res.send("Email incorreto");
            }

        }
        
    }

    async auth(req, res, next) {
        const authToken = req.headers['authorization'];

        if (authToken != undefined) {

            const bearer = authToken.split(' ');
            var token = bearer[1];

            jwt.verify(token, JWTSecret, (err, data) => {
                if (err) {
                    res.status(401);
                    res.json({ err: "Token inválido!" });
                } else {
                    req.token = token;
                    req.loggedUser = { id: data.id, email: data.email };
                    next();
                }
            });
        } else {
            res.status(401);
            res.json({ err: "Token inválido!" });
        }
    }

    async manageFollowing(req, res) {
        var id = req.loggedUser.id;
        var loggedUser = await User.find({ _id: id });
        var seguindo = loggedUser[0].seguindo;

        var { id_user } = req.body;
        var userToFollow = await User.find({ _id: id_user });
        var seguidores = userToFollow[0].seguidores;

        var remover = false;
        var msg = "Você seguiu o usuário!";

        if (seguindo.length > 0) {
            seguindo.forEach(s => {
                if (s._id == id_user) {
                    remover = true;
                    msg = 'Você não está mais seguindo este usuário!';
                }
            })
            if (remover == true) {
                seguindo.splice(seguindo.findIndex(s => s._id == id_user), 1);
                seguidores.splice(seguidores.findIndex(s => s._id == id), 1);
            } else {
                seguindo.push({ _id: id_user });
                seguidores.push({ _id: id });
            }
        } else {
            seguindo.push({ _id: id_user });
            seguidores.push({ _id: id });
        }
        await User.updateOne({ _id: id }, { seguindo: seguindo });
        await User.updateOne({ _id: id_user }, { seguidores: seguidores });

        res.send(msg)

    }

}

module.exports = new UserService();
