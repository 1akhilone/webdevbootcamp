var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {name:"Granite Hill" , image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f1c87ba6eeb0bc_340.jpg",description:"blah blah blah"},
    {name:"Funny Camp" , image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c87ba6eeb0bc_340.jpg",description:"blah blah blah"},    
    {name:"Funny Camp" , image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104490f1c87ba6eeb0bc_340.jpg",description:"blah blah blah"},
    ]

function seedDB(){
    //Remove All Campgrounds
    Campground.remove({},function(err){
       if(err){
           console.log(err);
       } 
       else{
           console.log("All campgrounds removed");
            //Add few Campgrounds
            data.forEach(function(seed){
               Campground.create(seed,function(err,data){
                   if(err){
                       console.log(err);
                   }
                   else{
                       console.log("added a campground");
                       //create a comment
                       Comment.create(
                           {
                               text:"This place is great but i wish it has internet",
                               author:"hello"
                           },function(err,comment){
                               if(err){
                                   console.log(err);
                               }
                               else{
                               data.comments.push(comment);
                               data.save();
                               console.log("created a new comment");
                               }
                       });
                   }
               });
            });
       }
    });
    // Add few comments
}

module.exports = seedDB;