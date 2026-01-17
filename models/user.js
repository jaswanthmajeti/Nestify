const mongoose = require('mongoose');
const schema =  mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema =new schema({
    email:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:"https://res.cloudinary.com/di7lzpyie/image/upload/v1768667475/blank-profile-picture-973460_1280-1030x1030_ahjysy.png"
    }
},{
    timestamps:true
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);