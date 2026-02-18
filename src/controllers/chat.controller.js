import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const captureChat = asyncHandler((req, res) => {
    const { name, email, phone } = req.body
    if (!email) {
        throw new ApiError(400, 'fuck you')
    }
    const resData = {
        name: name,
        email: email,
        phone: phone
    }
    return res.status(200).json(
        new ApiResponse(200, resData, "working")
    )
})