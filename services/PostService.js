var post = require("../models/Post");
var mongoose = require("mongoose");

const Post = mongoose.model("Post", post);

class PostService{

    async create(req, res){
        var {id_user, tema, descricao, fotoPublicacao, curtidaDetalhe, comentarios, data} = req.body;

        var newPost = new Post({   
            id_user, 
            tema, 
            descricao, 
            fotoPublicacao, 
            curtidaDetalhe, 
            comentarios, 
            data     
        });
        try{
            await newPost.save();
            res.status(200);
            res.send("Cadastro de post realizado!");
            return true;
        }catch{
            console.log(err);
            res.send("Algo deu errado :(")
            return false;
        }
        
    }

    async getAll(req, res){

        try{
            var consultas = await Post.find();
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
            var post = await Post.find({'_id': id});
            res.json(post);
        }catch{
            console.log(err);
            res.send("consulta inválida");
            return false;
        }
    }

    async delete(req, res){
        var id = req.params.id;
        try{
            await Post.deleteOne({'_id': id});
            res.send("Publicação deletada");
        }catch{
            console.log(err);
            res.send("Não foi possível deletar a publicação");
            return false;
        }
    }

    async update(req, res){
        var {id_user, tema, descricao, fotoPublicacao, data} = req.body
        var id = req.params.id;
        try{
            await Post.updateOne({'_id': id}, {id_user, tema, descricao, fotoPublicacao, data});
            res.send("Post atualizado");
        }catch{
            console.log(err);
            res.send("Não foi possível atualizar o post");
            return false;
        }
    }

}

module.exports = new PostService();