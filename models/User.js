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
    products: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        }
    ],
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
    status:{
        type:String,
        enum: ["Active", "InActive"],
        default: "Active",
    }
},
{timestamps:true}
);

userSchema.pre('save', function(next) {
    if(this.accountType !== 'Admin') {
        this.products = undefined;
    }
    next();
})

module.exports = mongoose.model("User", userSchema);