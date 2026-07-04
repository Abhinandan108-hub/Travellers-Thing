import express from "express";
import Booking from "../models/Booking.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
export const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user?._id }).populate("package");
        res.status(200).json({
            success: true,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAllBookings = async (_req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("package");
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user")
            .populate("package");
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: booking,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createBooking = async (req, res, next) => {
    try {
        const { package: packageId, numberOfTravellers, totalAmount, travelDate, travellers, contactInfo, specialRequests, } = req.body;
        const booking = await Booking.create({
            user: req.user?._id,
            package: packageId,
            numberOfTravellers,
            totalAmount,
            travelDate,
            travellers,
            contactInfo,
            specialRequests,
        });
        await booking.populate(["user", "package"]);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateBookingStatus = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true,
        }).populate(["user", "package"]);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: booking,
        });
    }
    catch (error) {
        next(error);
    }
};
export const cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: "Booking not found",
            });
            return;
        }
        booking.status = "cancelled";
        await booking.save();
        await booking.populate(["user", "package"]);
        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    }
    catch (error) {
        next(error);
    }
};
