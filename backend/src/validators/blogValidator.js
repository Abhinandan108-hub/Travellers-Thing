import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const createBlogValidator = (req, res, next) => {
    const { title, content, coverImage, category } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        badRequest(res, 'Title is required and must be at least 3 characters');
        return;
    }
    if (!content || typeof content !== 'string' || content.trim().length < 20) {
        badRequest(res, 'Content is required and should be substantive');
        return;
    }
    if (!coverImage || typeof coverImage !== 'string') {
        badRequest(res, 'Cover image is required');
        return;
    }
    if (!category || typeof category !== 'string') {
        badRequest(res, 'Category is required');
        return;
    }
    next();
};
export const updateBlogValidator = (req, res, next) => {
    const { title, content } = req.body;
    if (!title && !content && !req.body.isPublished) {
        badRequest(res, 'At least one updatable field must be provided');
        return;
    }
    next();
};
export default {};
