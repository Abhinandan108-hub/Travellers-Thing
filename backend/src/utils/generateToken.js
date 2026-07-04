import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign({ id }, secret, { expiresIn });
};
export default generateToken;
