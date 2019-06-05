var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments-NEW
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       }
       else{
           res.render("comments/new",{campground:campground});
       }
    });
});


//Comments-CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
   
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else{
           Comment.create(req.body.comment,function(err,comment){
               if(err){
                   console.log(err);
               }
               else{
                   //add user and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success","succesfully added comment");
                   res.redirect("/campgrounds/"+ campground._id);
               }
           });
       }
   }); 
});

//Comments edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    //req.params.id contains campground id
    //req.params.comment_id contains comment id
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{campground_id : req.params.id,comment:foundComment});
        }
    });
});

//comments update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//comment destroy
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

/*

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req,res,next){
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
                        res.redirect("back");
                    }
                }
            });
        } else{
            res.redirect("back");
        }
        //otherwise redirect
    //if not,redirect
}
*/


module.exports = router;