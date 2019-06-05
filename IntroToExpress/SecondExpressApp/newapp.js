var express = require("express");
var app = express();

app.get("/",function(req,res){
   res.send("Hi there,Welcome to my assignment!!"); 
});

app.get("/speak/:animal",function(req,res){
   var animal = req.params.animal.toLowerCase();
   var sounds = {
       pig : "Oink",
       dog : "Woof Woof",
       cat : "Meow",
       rat : "keech",
   }
   res.send("The "+ animal + " Says " + sounds[animal]);
});

app.get("/repeat/:item/:num",function(req, res) {
   var item = req.params.item;
   var num = parseInt(req.params.num);
   var str = "";
   for(var i=0;i<num;i++){
       str += item+" ";
   }
   res.send(str);
});

app.get("*",function(req, res) {
   res.send("Sorry! Page Not found....What are you doing with ur life???") 
});


// to listen and to get url in webpage listen is needed.

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("My New App Started!!"); 
});