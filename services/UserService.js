var user = require("../models/User");
var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");
const JWTSecret = "Starwars";

const User = mongoose.model("User", user);

class UserService{

    async create(req, res){
        var {nome, departamento, cargo, email, data_nascimento, 
            telefone, admin, foto, senha, seguindo, seguidores, grupos} = req.body;

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
        try{
            await newUser.save();
            res.status(200);
            res.send("Cadastro de usuário realizado!");
            return true;
        }catch{
            console.log(err);
            res.send("Algo deu errado :(")
            return false;
        }
        
    }

    async getAll(req, res){

        try{
            var consultas = await User.find();
            res.json(consultas);
            return true;
        }catch{
            console.log(err);
            res.send("Consulta inválida");
            return false;
        }
    }

    async findById(req, res){
        var id = req.params.id;
        try{
            var user = await User.find({'_id': id});
            res.json(user);
        }catch{
            console.log(err);
            res.send("consulta inválida");
            return false;
        }
    }

    async delete(req, res){
        var id = req.params.id;
        try{
            await User.deleteOne({'_id': id});
            res.send("Usuário deletado");
        }catch{
            console.log(err);
            res.send("Não foi possível deletar o usuário");
            return false;
        }
    }

    async update(req, res){
        var {nome, departamento, cargo, email, data_nascimento, 
            telefone, admin, foto, senha } = req.body
        var id = req.params.id;
        try{
            await User.updateOne({'_id': id}, {nome: nome, departamento: departamento, cargo: cargo, 
                email: email, data_nascimento: data_nascimento, telefone:telefone, admin: admin, foto: foto, senha: senha});
            res.send("Usuário atualizado");
        }catch{
            console.log(err);
            res.send("Não foi possível atualizar o usuário");
            return false;
        }
    }

    async token(req, res){
        var id = req.params.id;
        var {email, senha} = req.body;

        var userEmail = await User.find({'_id': id}, {email: 1, _id: 0});
        var userSenha = await User.find({'_id': id}, {senha: 1, _id: 0});

        var reqSenha =[
            {
                senha: senha
            }
        ]
        //console.log(reqSenha, userSenha);
        if(user != undefined){
                try{
                    var token = jwt.sign({id: id, email: userEmail}, JWTSecret, {expiresIn: '48h'});
                    res.status(200);
                    res.json({token: token});
                }catch{
                    res.status(400);
                    res.json("Falha interna");
                }
        }
    }

    async auth(req, res, next){
        const authToken = req.headers['authorization'];
    
        if(authToken != undefined){

            const bearer = authToken.split(' ');
            var token = bearer[1];

            jwt.verify(token,JWTSecret,(err, data) => {
                if(err){
                    res.status(401);
                    res.json({err:"Token inválido!"});
                }else{
                    req.token = token;
                    req.loggedUser = {id: data.id,email: data.email};               
                    next();
                }
            });
        }else{
            res.status(401);
            res.json({err:"Token inválido!"});
        } 
    
    }
}

module.exports = new UserService();
