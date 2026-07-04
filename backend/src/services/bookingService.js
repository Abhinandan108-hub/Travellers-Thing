import Booking from '../models/Booking.js';
export const createBooking = async (payload) => {
    const booking = await Booking.create(payload);
    return booking.populate(['user', 'package']);
};
export const getBookingById = async (id) => {
    return Booking.findById(id).populate('user').populate('package');
};
export const getUserBookings = async (userId) => {
    return Booking.find({ user: userId }).populate('package');
};
export const getAllBookings = async () => {
    return Booking.find().populate('user', 'name email').populate('package');
};
export const updateBookingStatus = async (id, status) => {
    return Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate(['user', 'package']);
};
export const cancelBooking = async (id) => {
    const booking = await Booking.findById(id);
    if (!booking)
        return null;
    booking.status = 'cancelled';
    await booking.save();
    return booking.populate(['user', 'package']);
};
export default { createBooking, getBookingById, getUserBookings, getAllBookings, updateBookingStatus, cancelBooking };
