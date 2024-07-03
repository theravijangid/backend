const express = require('express');
const router = express.Router();

const {createProduct} = require("../controllers/Product")
const {auth, isAdmin} = require("../middleware/auth");


router.post("/createProduct",auth, isAdmin, createProduct);

module.exports = router;