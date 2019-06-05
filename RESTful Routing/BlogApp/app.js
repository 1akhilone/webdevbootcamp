var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser:true});

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// this should be after body parser compulsarily
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

//NEW route
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

//CREATE route

app.post("/blogs",function(req,res){
    //sanitizer includes html tags in the body or description but removes script and some js tags inside the description 
   req.body.blog.body = req.sanitize(req.body.blog.body);
   
   Blog.create(req.body.blog,function(err,newBlog){
       if(err){
           res.render("new");
       }
       else{
           res.redirect("/blogs");
       }
   }); 
});

//SHOW route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog: foundBlog});
        }
    })
});

//EDIT route
app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.render("edit",{blog:foundBlog});
       }
   })
});

//UPDATE route
app.put("/blogs/:id",function(req,res){
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//Destroy Route
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");   
        }
        else{
            res.redirect("/blogs");
        }
    });
});





app.listen(process.env.PORT,process.env.IP,function(){
    console.log("BlogApp Started!!");
});