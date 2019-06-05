var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//landing page
router.get("/",function(req,res){
    res.render("landing");
});

//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handling register logic
router.post("/register",function(req,res){
   var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           //req.flash("error",err.message);
           //console.log(err);
           return res.render("register",{"error":err.message});
       }
       else{
           passport.authenticate("local")(req,res,function(){
              req.flash("success","Welcome To YelpCamp " + user.username);
              res.redirect("/campgrounds"); 
           });
       }
   }); 
});

//login
router.get("/login",function(req,res){
   res.render("login"); 
});

//handling login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
    }),
    function(req,res){
        /*passport.authenticate("local")(req,res,function(){
              req.flash("success","Welcome To YelpCamp " + currentUser);
              res.redirect("/campgrounds"); 
           });*/
});

//logout
router.get("/logout",function(req,res){
    req.logout();
    req.flash("error","Logged You Out!");
    res.redirect("/campgrounds");
});
/*
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
*/
module.exports = router;