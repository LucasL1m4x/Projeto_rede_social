const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var router = require("./routes/routes")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://lucas_teixeira:root@cluster0.luuic.mongodb.net/test", 
{useNewUrlParser: true, 
useUnifiedTopology: true});

app.use("/", router);

app.get("/", (req, res)=>{
    res.send("Oi!");
});

app.listen(8686,() => {
    console.log("Servidor rodando")
});



