const express = require("express");
const router = express.Router();

const{signUp, login, sendOTP, changePasword} = require("../controllers/Auth");
const {auth, isAdmin, isUser} = require("../middleware/auth");
const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
router.post("/login", login)
router.post("/signup", signUp)
router.post("/sendotp", sendOTP)
router.post("/changePassword", auth, changePasword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword)

module.exports = router;