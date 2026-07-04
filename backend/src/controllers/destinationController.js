import express from "express";
import Destination from "../models/Destination.js";
export const getDestinations = async (req, res, next) => {
    try {
        const { category, isPopular, search, page = 1, limit = 10 } = req.query;
        const query = {};
        if (category)
            query.category = category;
        if (isPopular)
            query.isPopular = isPopular === "true";
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ];
        }
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const total = await Destination.countDocuments(query);
        const destinations = await Destination.find(query)
            .sort("-createdAt")
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            success: true,
            count: destinations.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            data: destinations,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            res.status(404).json({
                success: false,
                message: "Destination not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: destination,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createDestination = async (req, res, next) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({
            success: true,
            message: "Destination created successfully",
            data: destination,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!destination) {
            res.status(404).json({
                success: false,
                message: "Destination not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Destination updated successfully",
            data: destination,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteDestination = async (req, res, next) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if (!destination) {
            res.status(404).json({
                success: false,
                message: "Destination not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Destination deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
