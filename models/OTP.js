const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender')

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },
});



// A function to send mail
async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse = await mailSender(email, "Verification email", otp);
        console.log("Email sent successfully", mailResponse);
    } catch (error) {
        console.log("Error occured while sending mail: ",error);
        throw error;
    }
}


//PRE
OTPSchema.pre("save", async function(next) {
    console.log("New document saved to database");

        if(this.isNew) {
            await sendVerificationEmail(this.email, this.otp);
        }
    next();
});

module.exports = mongoose.model("OTP", OTPSchema)