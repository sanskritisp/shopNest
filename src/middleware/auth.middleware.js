import AsyncHandler from "../utils/AsyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";



const jwtAuth = AsyncHandler(async(req, res, next) => {

    const accessToken = req.cookies.accessToken
    if (!accessToken) throw new ApiError(400, 'Access token Denied')

    const decodeAccessToken = jwt.decode(accessToken);

    const user = await User.findById(decodeAccessToken.id).select('-password -refreshToken')

    if (!user) throw new ApiError(401, 'USER NOT FOUND')

    req.user = user
    next()
})
export default jwtAuth;