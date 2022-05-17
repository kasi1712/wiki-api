//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//------------------------------------------ Request targeting all articles ----------------------------------

app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){

    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
}) 

.post(function(req, res){

  const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
  });
    newArticle.save(function(err){
      if(!err){
        res.send("successfully added a new article");
      }
      else{
        res.send(err);
      }
    });

}) 

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("deleted successfully");
    }
    else{
      res.send(err);
    }
  });
})

//-------------------------------- Request targeting a specific articles ----------------------------------
 app.route("/articles/:articleTitle")

 .get(function(req, res){
   Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
     if(foundArticles){
       res.send(foundArticles);
     }
     else{
       res.send("no articles found");
     }
   });
 })

 .put(function(req, res){
   Article.updateMany(
     {title: req.params.articleTitle},
     {title: req.body.title, content: req.body.content},
     {overwrite: true},
     function(err){
       if(!err){
         res.send("The data is updated successfully.");
       }
     });
 })

 .patch(function(req,res){
   Article.updateMany(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
        if(!err){
          res.send("updated successfully");
        }
        else{
          res.send(err);
        }
    });
 })

 .delete(function(req,res){
   Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Deleted successfully");
      }
      else{
        res.send(err);
      }
    }
   )
 });

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});