var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    mobileNumber:String,
    password:String
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);