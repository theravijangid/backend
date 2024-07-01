const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcrypt');



// Signup Controller for Registering USers
exports.signUp = async (req,res) => {
    try {
        // fetch data
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            gender,
            phoneNumber,
            age,
            occupation,
            otp,
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !age || !phoneNumber || !gender || !occupation || !otp) {
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        // pasword are matching
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Password and confirmPasssword value does not match, please try again',
            });
        }

        // check user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }


        //find most recent otp stored for the user
        const response = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("recent otp: ", response);

        // validate otp
        if(response.length === 0) {
            return res.status(400).json({
                success:false,
                message:'OTP not Found',
            })
        } else if (otp !== response[0].otp) {
            return res.status(400).json({
				success: false,
				message: "OTP is not valid",
			});
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create entry in db
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            age,
            occupation,
            gender,
            accountType,
            images: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        return  res.status(200).json({
            success:true,
            message:'User is registered successfully',
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again",
        })
    }
}


// User Login
exports.login = async(req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(403).json({
                success:false,
                message:'All fiels are required, please try again',
            });
        }

        //check user
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered, please signup first',
            });
        }

        // generate jwt, after password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "logged in successfully",
            })

        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is Incorrect',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Not able to login , please try again later',
        });
    }
}


//send OTP
exports.sendOTP = async(req,res) => {
    try {
        //fetch email from the req body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        //Generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars: false,
        });
        console.log("Generated OTP.....",otp);

        //check unique otp
        const result = await OTP.findOne({otp:otp});
        console.log("result...",result);

        while(result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets:false,
                specialChars: false,
            })
        }

        const otpPayload = {email, otp}
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP body.......", otpBody);

         res.status(200).json({
            success: true,
            message:'OTP sent successfully',
            otp,
         })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};



// Change password
exports.changePasword = async (req, res) => {
    try {
        const userData = await User.findById(req.user.id);
        const {currPassword, newPassword, confirmNewPassword} = req.body;

        if(!currPassword || !newPassword) {
            return res.status(401).json({
                success:false,
                message:'All fields are mandatory',
            });
        }

        // current password validation
        const isPasswordMatch = await bcrypt.compare(currPassword, userData.password);
        if(!isPasswordMatch) {
            return res.status(401).json({
                success:false,
                message:'The password is incorrect',
            });
        }

        // update the password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        // update pass in DB
        const updatedUserData = await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new:true} 
        );

        // sending mail  i.e password has been updated
        try {
            const emailResponse = await mailSender(
                updatedUserData.email,
                "Password Change",
                `Password updated successfully for ${updatedUserData.firstName} ${updatedUserData.lastName}`
            );
            // console.log("Email sent...", emailResponse);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

        return res.status(200).json({
            success:true,
            message:'Password changed successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while changing the password. Please try again later',
        });
    }
}