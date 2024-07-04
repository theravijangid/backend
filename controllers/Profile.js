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


exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // fetch data
        const {
            firstName="",
            lastName="",
            gender="",
            phoneNumber="",
            age="",
            occupation="",
            status
        } = req.body;

        const updatedStatus = status || "Active";
        // find profile
        const profileDetails = await User.findByIdAndUpdate(
            userId,{
                firstName,
                lastName,
                gender,
                phoneNumber,
                age,
                occupation,
                status: updatedStatus,
            },
            {new: true}
        )
        
        // return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated successfully',
            profileDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to update Profile Details, Please try again',
        });
    }
}