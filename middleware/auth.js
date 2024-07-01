const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth = async (req, res, next) => {
    try {
        // token extraction
        const token = req.cookies.token || req.body.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ",""));
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'Token is Missing',
            });
        }

        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token", decode);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:'something went wrong while validating token',
        });
    }
}


// isAdmin
exports.isAdmin = async(req,res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role cannot be identified, Please try again later',
        });
    }
}


// isUser
exports.isUser = async (req, res, next) => {
    try {
        if(req.user.accountType !== "User") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for User only',
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'User role cannot be identified, Please try again later',
        });
    }
}