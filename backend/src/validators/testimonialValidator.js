import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const createTestimonialValidator = (req, res, next) => {
    const { rating, review } = req.body;
    if (rating === undefined || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        badRequest(res, 'Rating is required and must be a number between 1 and 5');
        return;
    }
    if (!review || typeof review !== 'string' || review.trim().length < 10) {
        badRequest(res, 'Review text is required and must be at least 10 characters');
        return;
    }
    next();
};
export const approveTestimonialValidator = (req, res, next) => {
    const { isApproved } = req.body;
    if (typeof isApproved !== 'boolean' && req.body.isApproved !== undefined) {
        badRequest(res, 'isApproved must be a boolean');
        return;
    }
    next();
};
export default {};
