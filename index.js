const express = require("express")
const app = express();

const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 3000;

// Database connection
database.connect();


// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
})) 

// connection to cloudinary
cloudinaryConnect();

// Api route mount
app.use("/v1/BanjaraProducts/auth", userRoute);
app.use("/v1/BanjaraProducts/product", productRoute);

app.get('/', (req, res) => {
    return res.json({
        success:true,
        message:'Your server is up and running....',
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})