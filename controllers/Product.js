const Product = require("../models/Product");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");



exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        /// fetching data
        let {
            productTitle,
            productDescription,
            whatsapp,
            contactNumber,
        } = req.body;

        // get product image
        const productImage = req.files.productimage;
        console.log("Product image....", productImage);

        // validation 
        if(!productTitle || !productDescription || !whatsapp || !contactNumber || !productImage) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        // check for admin
        const adminDetails = await User.findById(userId, {
            accountType:"Admin",
        });

        if(!adminDetails) {
            return res.status(404).json({
                success:false,
                message:'Admin not found',
            });
        }

        // Upload the image to cloudinary
        const productThumbnail = await uploadImageToCloudinary(productImage, process.env.FOLDER_NAME);

        // create entry in DB
        const newProduct = await Product.create({
            productTitle,
            productDescription,
            admin: adminDetails._id,
            whatsapp,
            contactNumber,
            image: productThumbnail.secure_url,
        });

        // add the new product to the user schema of admin
        await User.findByIdAndUpdate(
            {_id: adminDetails._id},
            {
                $push:  {
                    products: newProduct._id,
                }
            },
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:'Product Created Successfully',
            data:newProduct,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create product',
            error: error.message,
        });
    }
}