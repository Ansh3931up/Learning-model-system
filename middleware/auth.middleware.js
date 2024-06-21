import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.js";
import ApiError from "../utilities/ApiError.js";
import { User } from "../module/user.model.js";

export const verifyjwt = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(404, "No token provided");
        }

        // Verify JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user by decoded token's _id
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Attach user object to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyjwt middleware:", error);
        // Respond with an error
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
});
