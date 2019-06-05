//RUN MONGOD BACK TO CONNECT TO YOUR DATABASE COMPULSORILY

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User  = require("./models/user");
var seedDB = require("./seeds");
var dotenv = require("dotenv");

dotenv.config();


//Requiring Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB(); //seed the database
//configure flash before passport
app.use(flash());
//passport configuration
app.use(require("express-session")({
    secret:"Yelpcamp is under constrution",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//gives currentuser status to every template and route if exists
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//connecting to database
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


/*app.get("/",function(req,res){
    res.render("landing");
});

//INDEX- displays all campgrounds
app.get("/campgrounds",function(req,res){
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
app.post("/campgrounds",function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampGround = {name:name , image:image , description:description}
    //create a newcampground and save to db
    Campground.create(newCampGround,function(err,newlyCreated){
       if(err){
           console.log(err);
       } 
       else{
           // redirecting back to campgrounds page
           res.redirect("/campgrounds");
       }
    });
    
});

//NEW- displays form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});


//SHOW -shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
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

/=============================/
//COMMENTS ROUTE

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err);
       }
       else{
           res.render("comments/new",{campground:campground});
       }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
   
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
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+ campground._id);
               }
           });
       }
   }); 
});

//Auth-Routes
//signup
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
   var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       else{
           passport.authenticate("local")(req,res,function(){
              res.redirect("/campgrounds"); 
           });
       }
   }); 
});

//login
app.get("/login",function(req,res){
   res.render("login"); 
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
    }),
    function(req,res){
});

//logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

//function for checking login in middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}  */


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("YelpCamp Server has Started!"); 
});
