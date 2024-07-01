const User = require("../models/User");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


exports.resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;
        //check user for email
        const isEmailExist = await User.findOne({email: email});
        if(!isEmailExist) {
            return res.json({
                success:false,
                message:'Your Email is not Registered with us',
            });
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex");
        //update user by adding token and expiration time
        const updatedData = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}
        );

        // create Url
        const url = `http://localhost:3000/reset-password/${token}`;
        // sending email with url
        await mailSender(
            email,
            "Rsest Password Link",
            `Rsest password here: ${url}`
        );

        return res.json({
            success:true,
            message:'Email sent successfully, please check email and change password',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password link',
        })
    }
}


// Rsest Password
exports.resetPassword = async (req, res) => {
    try {
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword) {
            return res.json({
                success:false,
                message:'Password is not matching. Please enter same password in both fields',
            });
        }
        // get userdetails from db using token
        const userdetails = await User.findOne({token:token});
        if(!userdetails) {
            return res.json({
                success:false,
                message:'Token is invalid',
            });
        }

        // token time check
        if( userdetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success:false,
                message:'Token is expired, please generate a new token',
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // password update in db
        await User.findOneAndUpdate(
            {token: token},
            {password:hashedPassword},
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:'Your Password has been Reset',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Error while password reset, please try again later',
        });
    }
}