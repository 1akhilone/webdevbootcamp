var express = require('express');
var path = require('path');

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blood_app',{ useNewUrlParser: true } );

var bloodGroupSchema = new mongoose.Schema({
    
    firstname : String,
    lastname : String,
    DOB : String,
    bloodgroup : String,
    location : String,
    mobile : String
});

var Bloodgroup = mongoose.model("BloodGroup",bloodGroupSchema);

app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("home");
});

app.get('/register',function(req,res){
    res.render('register');
});

app.get('/adduser',function(req,res){
    
    var fname = req.query.fname;
    var lname = req.query.lname;
    var dob = req.query.dob;
    var bgroup = req.query.type;
    var location = req.query.location;
    var mobile = req.query.mbo;
    var newuser = {firstname:fname, lastname:lname , DOB:dob , bloodgroup:bgroup , location : location , mobile:mobile};
    
    Bloodgroup.create(newuser,function(err,newuser){
      if(err){
          console.log("hello");
          console.log(err);
      }
      else{
          console.log("database added succefully");
      }
    });
    console.log(Bloodgroup.find({firstname:"fname"}));
    res.redirect('/');
});

app.get('/requests',function(req,res){
    res.render("request");
})


app.get("/request",function(req,res){
    var fname = req.query.firstname;
    var lname = req.query.lastname;
    var location = req.query.loc;
    var bloodgroup = req.query.type;
    var users;
    Bloodgroup.find({},function(err,allusers){
        if(err){
            console.log(err);
        }
        else{
        users = allusers;
        res.render('requests',{fname:fname,lname:lname,location:location,bg:bloodgroup,allusers:users});
        }
    });
});


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has Started"); 
});

