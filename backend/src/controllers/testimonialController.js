import express from "express";
import Testimonial from "../models/Testimonial.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
export const getTestimonials = async (req, res, next) => {
    try {
        const { isFeatured } = req.query;
        const query = {
            isApproved: true,
        };
        if (isFeatured) {
            query.isFeatured = isFeatured === "true";
        }
        const testimonials = await Testimonial.find(query)
            .populate("user", "name avatar")
            .populate("package", "title")
            .populate("destination", "name")
            .sort("-createdAt");
        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getAllTestimonials = async (_req, res, next) => {
    try {
        const testimonials = await Testimonial.find()
            .populate("user", "name avatar email")
            .populate("package", "title")
            .sort("-createdAt");
        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.create({
            ...req.body,
            user: req.user?._id,
        });
        res.status(201).json({
            success: true,
            message: "Testimonial submitted for review",
            data: testimonial,
        });
    }
    catch (error) {
        next(error);
    }
};
export const approveTestimonial = async (req, res, next) => {
    try {
        const { isApproved, isFeatured } = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, { isApproved, isFeatured }, { new: true });
        if (!testimonial) {
            res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Testimonial updated",
            data: testimonial,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Testimonial deleted",
        });
    }
    catch (error) {
        next(error);
    }
};
