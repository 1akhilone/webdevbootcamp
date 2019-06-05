var express = require('express');
var app = express();
var request = require('request');
app.set("view engine","ejs");


app.get("/",function(req,res){
   res.render("search");
});


app.get('/results',function(req,res){
   var search = req.query.search;
   var url = "http://www.omdbapi.com/?s="+search+"&apikey=thewdb";
   request(url,function(error,response,body){
      if(!error && response.statusCode==200){
          var data = JSON.parse(body);
          res.render("results",{data:data,search:search});
      } 
      else{
         res.send("No movie exists with this name");
      }
   });
});

app.get("/imdbid",function(req, res) {
   var search = req.query.search;
   var mname = req.query.mname;
   var url = "http://www.omdbapi.com/?s="+search+"&apikey=thewdb";
   request(url,function(error,response,body){
      if(!error && response.statusCode==200){
          var data = JSON.parse(body);
          var result = "imbd id of your selected movie is " + data["Search"][parseInt(mname)-1]["imdbID"];
          res.send(result);
          }
   });
});



app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Welcome to movie world!!"); 
});