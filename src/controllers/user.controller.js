import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import UploadOnCloudinary from "../utils/UploadOnCloudinary.js";

//--create new user--//

const createUser = AsyncHandler(async(req, res) => {
    const { fullName, username, email, password, gender } = req.body;
    const imageLocalPath = req.file && req.file.path;

    // check for blank fields

    if ([fullName, username, email, password].some((_field) => !_field.trim())) {
        throw new ApiError(400, "Fill all the required fields !!");
    }

    //  checking if user alredy existed

    const user = await User.findOne({ username });
    if (user) throw new ApiError(401, "User Already Existed !!");

    //  uploading image

    const response = await UploadOnCloudinary(imageLocalPath);
    const image = response.url;
    const newUser = await User.create({
        username,
        fullName,
        email,
        password,
        image,
    });
    const displayUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    );
    res.status(200).json(ApiResponse(200, displayUser, "User created"));
});

export { createUser };