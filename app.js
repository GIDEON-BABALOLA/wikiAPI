const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json())
const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/wikiDB"
mongoose.connect(url, {
useNewUrlParser: true,
useUnifiedTopology:true }
)
const articleSchema = new mongoose.Schema( {
    name : String,
    content : String
}
)
const articleModel =  mongoose.model("article", articleSchema);
app.route("/articles")
.get((req, res)=>{
    articleModel.find()
    .then((data)=>{
res.send(data)
    })
    .catch((error)=>{
res.send(error)
    })
})
.post((req, res)=>{
    console.log(req.body.name);
    console.log(req.body.content)
    const article = new articleModel({
        name : req.body.name,
        content : req.body.content
    })
    article.save()
    .then((data)=>{
        res.send("Successfully made a POST request")
    })
    .catch((error)=>{
        res.send(error)
    })
})
.delete( (req, res)=>{
    articleModel.deleteMany()
    .then((data)=>{
        res.send("Successfully deleted all the articles")
    })
    .catch((error)=>{
        res.send("Error")
    })
})
app.route("/articles/:value")
.get((req, res)=>{
articleModel.findOne({name : req.params.value})
    .then((data)=>{
if(!data){
    res.send("Unable to find the article matching the parameter you have entered")
}
else{
    res.send(data)
}
    })
    .catch((error)=>{
        res.send(error)
    })
})
.put((req, res)=>{
    console.log(req.params.value)
    articleModel.replaceOne({name : req.params.value}, {name : req.body.name, content : req.body.content})
    .then((data)=>{
        res.send("Successfully updated the article with name " +req.params.value)
    })
    .catch((error)=>{
        res.send("Error in updating article with name " +req.params.value +error)
    })
})
.patch((req, res)=>{
    articleModel.updateOne({name : req.params.value}, {$set : req.body})
    .then((data)=>{
        res.send("Successfully Updated the article with the name " +req.params.value)
    })
    .catch((error)=>{
        res.send(error)
    })
})
.delete((req, res)=>{
    articleModel.deleteOne({name : req.params.value})
    .then((data)=>{
        res.send("Successfully deleted article with name " +req.params.value)
    })
    .catch((error)=>{
        res.send(error)
    })
})
app.listen(4000, ()=>{
    console.log("Server is running on port 4000")
})
