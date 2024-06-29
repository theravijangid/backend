const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin", "User"],
        required:true,
    },
    gender:{
        type:String,
    },
    phoneNumber:{
        type:String,
        required: true,
        trim:true,

    },
    age:{
        type:String,
        required: true,
    },
    occupation:{
        type:String,
        required:true,
        trim:true,
    },
    images:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
});

module.exports = mongoose.model("USer", userSchema);