import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const createPackageValidator = (req, res, next) => {
    const { title, destination, description, coverImage, duration, price } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        badRequest(res, 'Title is required and must be at least 3 characters');
        return;
    }
    if (!destination) {
        badRequest(res, 'Destination id is required');
        return;
    }
    if (!description || typeof description !== 'string') {
        badRequest(res, 'Description is required');
        return;
    }
    if (!coverImage || typeof coverImage !== 'string') {
        badRequest(res, 'Cover image is required');
        return;
    }
    if (!duration || Number(duration) <= 0) {
        badRequest(res, 'Duration (in days) is required and must be > 0');
        return;
    }
    if (price === undefined || isNaN(Number(price))) {
        badRequest(res, 'Price is required and must be a number');
        return;
    }
    next();
};
export const updatePackageValidator = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        badRequest(res, 'At least one field must be provided to update');
        return;
    }
    next();
};
export default {};
