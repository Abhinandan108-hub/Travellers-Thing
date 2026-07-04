import express from "express";
import Package from "../models/Package.js";
export const getPackages = async (req, res, next) => {
    try {
        const { destination, difficulty, isFeatured, isAvailable, minPrice, maxPrice, search, page = 1, limit = 10, } = req.query;
        const query = {};
        if (destination)
            query.destination = destination;
        if (difficulty)
            query.difficulty = difficulty;
        if (isFeatured)
            query.isFeatured = isFeatured === "true";
        if (isAvailable !== undefined)
            query.isAvailable = isAvailable === "true";
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.title = {
                $regex: search,
                $options: "i",
            };
        }
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const total = await Package.countDocuments(query);
        const packages = await Package.find(query)
            .populate("destination", "name country coverImage")
            .sort("-createdAt")
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            success: true,
            count: packages.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            data: packages,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getPackage = async (req, res, next) => {
    try {
        const pkg = await Package.findById(req.params.id).populate("destination", "name country coverImage climate bestTimeToVisit");
        if (!pkg) {
            res.status(404).json({
                success: false,
                message: "Package not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: pkg,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createPackage = async (req, res, next) => {
    try {
        const pkg = await Package.create(req.body);
        res.status(201).json({
            success: true,
            message: "Package created successfully",
            data: pkg,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updatePackage = async (req, res, next) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!pkg) {
            res.status(404).json({
                success: false,
                message: "Package not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Package updated successfully",
            data: pkg,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deletePackage = async (req, res, next) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);
        if (!pkg) {
            res.status(404).json({
                success: false,
                message: "Package not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Package deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
