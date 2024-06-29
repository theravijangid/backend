const express = require("express")
const app = express();

const database = require("./config/database")
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

// Database connection
database.connect();

app.get('/', (req, res) => {
    return res.json({
        success:true,
        message:'Your server is up and running....',
    })
})

app.listen(PORT, () => {
    console.log(`Serever is running on PORT: ${PORT}`)
})