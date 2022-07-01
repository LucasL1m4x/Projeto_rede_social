var post = require("../models/Post");
// var user = require("../models/User");
var mongoose = require("mongoose");

const Post = mongoose.model("Post", post);
// const User = mongoose.model("User", user);

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
        }catch(err) {
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
        }catch(err){
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
        }catch(err){
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
        }catch(err){
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
        }catch(err){
            console.log(err);
            res.send("Não foi possível atualizar o post");
            return false;
        }
    }

    async manageLike(req, res) {
        try {
            var { id_post } = req.body;
            var id_user = req.loggedUser.id;
            var post = await Post.find({ "_id": id_post });
            var curtidas = post[0].curtidaDetalhe;
            var remover = false;
            var msg = "Você curtiu a publicação!";
            
            if(curtidas.length > 0) {
                curtidas.forEach(c => {
                    if(c._id == id_user) {
                        remover = true;
                        msg = 'Sua curtida foi retirada da publicação!';
                    } 
                })
                if(remover == true){
                    curtidas.splice(curtidas.findIndex(c => c._id == id_user), 1);
                } else {
                    curtidas.push({"_id": id_user})
                }
            } else {
                curtidas.push({"_id": id_user})
            }
            await Post.updateOne({"_id": id_post}, {curtidaDetalhe: curtidas})
            res.send(msg)
        } catch (error) {
            res.send('Algo deu errado...')
            console.log(error);
        }
    }


    async addComment(req, res) {
        try {
            var { texto, id_post } = req.body;
            var id_user = req.loggedUser.id;
            var post = await Post.find({ "_id": id_post });
            var comentarios = post[0].comentarios;
            
            comentarios.push({ "idUser": id_user, "texto": texto });
            await Post.updateOne({_id: id_post}, {comentarios: comentarios});
            res.send('Comentário adicionado à publicação!')
        } catch (error) {
            res.send('Algo deu errado...')
            console.log(error);
        }
    }

}

module.exports = new PostService();