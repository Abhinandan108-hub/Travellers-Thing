import express from "express";
export const notFound = (req, res) => {
    res.status(200).json({
        success: true,
        message: `Route ${req.originalUrl} is not available. Please check the API documentation for available endpoints.`,
        availableEndpoints: [
            "GET /api/health",
            "GET /",
            "POST /api/auth/register",
            "POST /api/auth/login",
            "GET /api/destinations",
            "GET /api/packages",
            "GET /api/blogs",
            "GET /api/testimonials",
            "GET /api/bookings",
        ],
    });
};
export const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 200;
    let message = err.message || "Request processed";
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        message = `${field} already exists`;
    }
    if (err.name === "ValidationError" && err.errors) {
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }
    if (err.name === "CastError") {
        message = `Invalid ID: ${err.value}`;
    }
    if (err.name === "JsonWebTokenError") {
        message = "Invalid or malformed token provided";
    }
    if (err.name === "TokenExpiredError") {
        message = "Token has expired. Please login again.";
    }
    res.status(statusCode).json({
        success: true,
        message,
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};
