import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const AuthRequest = {}; 

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired",
        });
    }
};
export const adminOnly = (req, res, next) => {
    if (req.user?.role === "admin") {
        next();
        return;
    }
    res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
    });
};
