import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const createBookingValidator = (req, res, next) => {
    const { package: packageId, travelDate, numberOfTravellers, totalAmount, contactInfo } = req.body;
    if (!packageId) {
        badRequest(res, 'Package id is required');
        return;
    }
    if (!travelDate) {
        badRequest(res, 'Travel date is required');
        return;
    }
    if (!numberOfTravellers || Number(numberOfTravellers) < 1) {
        badRequest(res, 'Number of travellers must be at least 1');
        return;
    }
    if (totalAmount === undefined || isNaN(Number(totalAmount))) {
        badRequest(res, 'Total amount is required and must be a number');
        return;
    }
    if (!contactInfo || !contactInfo.phone || !contactInfo.email) {
        badRequest(res, 'Contact info with phone and email is required');
        return;
    }
    next();
};
export const updateBookingStatusValidator = (req, res, next) => {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!status || !allowed.includes(status)) {
        badRequest(res, `Status is required and must be one of: ${allowed.join(', ')}`);
        return;
    }
    next();
};
export default {};
