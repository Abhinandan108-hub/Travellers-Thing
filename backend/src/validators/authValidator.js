import express from 'express';
const badRequest = (res, message) => res.status(400).json({ success: false, message });
export const registerValidator = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        badRequest(res, 'Name is required and must be at least 2 characters');
        return;
    }
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        badRequest(res, 'A valid email is required');
        return;
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        badRequest(res, 'Password is required and must be at least 6 characters');
        return;
    }
    next();
};
export const loginValidator = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        badRequest(res, 'Email and password are required');
        return;
    }
    next();
};
export const updateProfileValidator = (req, res, next) => {
    const { name, phone, avatar } = req.body;
    if (!name && !phone && !avatar) {
        badRequest(res, 'At least one of name, phone or avatar must be provided');
        return;
    }
    next();
};
export const changePasswordValidator = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        badRequest(res, 'Current password and new password are required');
        return;
    }
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
        badRequest(res, 'New password must be at least 6 characters');
        return;
    }
    next();
};
export default {};
