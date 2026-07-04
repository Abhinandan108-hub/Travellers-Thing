import User from '../models/User.js';
export const registerUser = async (payload) => {
    const user = await User.create(payload);
    return user;
};
export const authenticateUser = async (email) => {
    const user = await User.findOne({ email }).select('+password');
    return user;
};
export const getUserById = async (id) => {
    return User.findById(id).select('-password');
};
export const updateUserProfile = async (id, updates) => {
    return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
export const changeUserPassword = async (id, newPassword) => {
    const user = await User.findById(id).select('+password');
    if (!user)
        return null;
    user.password = newPassword;
    await user.save();
    return user;
};
export const listUsers = async () => {
    return User.find().sort('-createdAt');
};
export default {
    registerUser,
    authenticateUser,
    getUserById,
    updateUserProfile,
    changeUserPassword,
    listUsers,
};
