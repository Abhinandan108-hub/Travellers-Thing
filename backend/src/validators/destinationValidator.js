import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const createDestinationValidator = (req, res, next) => {
    const { name, country, description, shortDescription, coverImage, category } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        badRequest(res, 'Name is required and must be at least 2 characters');
        return;
    }
    if (!country || typeof country !== 'string') {
        badRequest(res, 'Country is required');
        return;
    }
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
        badRequest(res, 'Description is required and should be substantive');
        return;
    }
    if (!shortDescription || typeof shortDescription !== 'string') {
        badRequest(res, 'Short description is required');
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
export const updateDestinationValidator = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        badRequest(res, 'At least one field must be provided to update');
        return;
    }
    next();
};
export default {};
