const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")


exports.updateProfilePicture = async (req, res) => {
    try {
        const profilePicture = req.files.profilePicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            profilePicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updateProfile = await User.findByIdAndUpdate(
            {_id: userId},
            {images: image.secure_url},
            {new:true}
        )
        
        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updateProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
          })
    }
}