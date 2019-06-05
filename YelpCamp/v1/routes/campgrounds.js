var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// requiring and configuring env variables and keeping them secret
var dotenv = require('dotenv');
// .env is created in root directory and should be configured to be used in app
dotenv.config();
// Setting up multer and cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dpejec0xk', 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

//INDEX-ROUTE
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds , currentUser: req.user});
        }
    });
});

//CREATE- adds new campground to db
/*router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name:name , image:image , description:description , author:author , price:price}
    //create a newcampground and save to db
    Campground.create(newCampGround,function(err,newlyCreated){
       if(err){
           console.log(err);
       } 
       else{
           // redirecting back to campgrounds page
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
    
});*/
//CREATE- adds new campground to db
router.post("/",middleware.isLoggedIn,upload.single('image'), function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      Campground.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
});


//NEW- displays form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//SHOW -shows more info about one campground
router.get("/:id",function(req,res){
    //find the camp with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground}); 
        }
    });
});
//EDIT CAMPGROUND PAGE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.send(err);
        }
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

//UPDATE CAMPGROUND PAGE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   //find and update correct campground 
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds");
      } 
      else{
          res.redirect("/campgrounds");
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

function checkCampgroundOwnership(req,res,next){
    //is user logged in?
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err){
                    res.redirect("back");
                }
                else{
                    // does user own the campground
                    //foundCampground.author.id is mongoose object but req.user._id is String therefore use equal
                    if(foundCampground.author.id.equals(req.user._id)){
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