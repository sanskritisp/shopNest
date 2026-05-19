import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import UploadOnCloudinary from "../utils/UploadOnCloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//--create new user--//

const createUser = AsyncHandler(async(req, res) => {
    const { fullName, username, email, password, gender } = req.body;
    const imageLocalPath = req.file && req.file.path;

    // check for blank fields
    if ([fullName, username, email, password].some((_field) => !_field.trim())) {
        throw new ApiError(400, "Fill in all the required fields!");
    }
    //  checking if user alredy existed
    const user = await User.findOne({ username });
    if (user) throw new ApiError(401, "User Already Existed!");

    //  uploading image
    const response = await UploadOnCloudinary(imageLocalPath);
    const image = response.url;
    console.log("image------>", image);
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
// ---------------------------------------------get all users-------------------------------------------
const getUsers = AsyncHandler(async(req, res) => {
    const users = await User.find().select("-password");

    res.status(200).json(ApiResponse(200, users, "Users fetched successfully"));
});
// -------------------------------------------function: generating access and refresh token----------------------------
const generateAccessAndRefreshToken = (user) => {
    const accessToken = jwt.sign({ id: user._id, username: user.username, email: user.email },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign({ id: user._id },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
};
// -------------------------------------------login------------------------------
const login = AsyncHandler(async(req, res) => {
    const { username, password } = req.body;

    if ([username, password].some((field) => !(field && field.trim())))
        throw new ApiError(400, "Please enter the required fields");

    const user = await User.findOne({ username });
    if (!user) throw new ApiError(401, "user does not exist");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new ApiError(400, "PASSWORD IS INCORRECT");

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(user);

    const logginUser = await User.findByIdAndUpdate(
        user._id, {
            refreshToken: refreshToken,
        }, { new: true }
    );

    const options = { httpOnly: true, secure: true }
    res.status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshtoken', refreshToken, options)
        .json(ApiResponse(200, logginUser, "Logged in successfuly"));
});
// ----------------------------------------logout------------------------------
const logout = AsyncHandler(async(req, res) => {
    const user = req.user
    if (!user) throw new ApiError(401, 'ACCESS DENIED')

    const logoutUser = await User.findByIdAndUpdate(user._id, { refreshToken: '' }, { new: true })

    const options = { httpOnly: true, secure: true }

    res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshtoken', options)
        .json(ApiResponse(200, logout, 'user logout successfully'))
})

export { createUser, getUsers, login, logout };