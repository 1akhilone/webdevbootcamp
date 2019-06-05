var express = require("express");
var app = express();

//req-request res - response

app.get("/",function(req,res){
   res.send("hello"); 
});






app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server has Started!"); 
});