import express from "express";
import Blog from "../models/Blog.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
export const getBlogs = async (req, res, next) => {
    try {
        const { category, tag, search, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };
        if (category)
            query.category = category;
        if (tag)
            query.tags = { $in: [tag] };
        if (search)
            query.title = { $regex: search, $options: "i" };
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;
        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .populate("author", "name avatar")
            .sort("-publishedAt")
            .skip(skip)
            .limit(limitNumber);
        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            data: blogs,
        });
    }
    catch (error) {
        next(error);
    }
};
export const getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOneAndUpdate({
            slug: req.params.slug,
            isPublished: true,
        }, {
            $inc: { views: 1 },
        }, {
            new: true,
        }).populate("author", "name avatar");
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const createBlog = async (req, res, next) => {
    try {
        const blog = await Blog.create({
            ...req.body,
            author: req.user?._id,
        });
        res.status(201).json({
            success: true,
            message: "Blog created",
            data: blog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog updated",
            data: blog,
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog deleted",
        });
    }
    catch (error) {
        next(error);
    }
};
