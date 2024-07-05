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
        const {userId} = req.body;
        
        if(!userId) {
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        
        const updatedFields = {};
        const fields = ['firstName', 'lastName', 'gender', 'phoneNumber', 'age', 'occupation', 'status'];

        fields.forEach(field => {
            if(req.body[field] !== undefined) {
                updatedFields[field] = req.body[field];
            }
        });

        if(updatedFields.status === undefined) {
            updatedFields.status = "Active";
        }

        // find profile and update
        const profileDetails = await User.findByIdAndUpdate(
            userId,
            {$set: updatedFields},
            {new: true}
        );
        
        console.log("On Response............");
        // return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated successfully',
            data: profileDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to update Profile Details, Please try again',
        });
    }
}


// Get all users
exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({accountType: "User"});
        
        return res.status(200).json({
            success:true,
            message:'Users retrieved successfully',
            data: users
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to retrieve User details, Please try again',
        });
    }
}


// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const {userId} = req.body;
        
        const user = await User.findById(userId);
        if(!userId) {
            return res.status(404).json({
                success: false,
                message:"User not found"
            });
        }

        await User.findByIdAndDelete(
            {_id: userId}
        )

        return res.status(200).json({
            success:true,
            message:'Account deleted successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Unable to delete Account, Please try again',
        });
    }
}
