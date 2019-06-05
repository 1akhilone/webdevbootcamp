var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all middleware goes here
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err){
                    req.flash("error","Campground Not Found");
                    res.redirect("back");
                }
                else{
                    // does user own the campground
                    //foundCampground.author.id is mongoose object but req.user._id is String therefore use equal
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else{
            req.flash("error","You need to be LoggedIn to do that");
            res.redirect("back");
        }
        //otherwise redirect
    //if not,redirect
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    //is user logged in?
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err){
                    res.redirect("back");
                }
                else{
                    // does user own the comment
                    //foundComment.author.id is mongoose object but req.user._id is String therefore use equal
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else{
            req.flash("error","You need to be in LoggedIn to do that");
            res.redirect("back");
        }
        //otherwise redirect
    //if not,redirect
}


middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be LoggedIn to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;