const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productTitle:{
        type:String,
        required:true,
        trim:true,
    },
    productDescription:{
        type:String,
        required:true,
        trim:true,
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatsapp:{
        type:String,
        required:true,
        required:true,
        trim:true,
    },
    contactNumber:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("Product", productSchema);