import Testimonial from '../models/Testimonial.js';
export const getTestimonials = async (query = {}) => {
    return Testimonial.find(query).populate('user', 'name avatar').populate('package', 'title').populate('destination', 'name').sort('-createdAt');
};
export const getAllTestimonials = async () => {
    return Testimonial.find().populate('user', 'name avatar email').populate('package', 'title').sort('-createdAt');
};
export const createTestimonial = async (payload) => {
    return Testimonial.create(payload);
};
export const approveTestimonial = async (id, updates) => {
    return Testimonial.findByIdAndUpdate(id, updates, { new: true });
};
export const deleteTestimonial = async (id) => {
    return Testimonial.findByIdAndDelete(id);
};
export default { getTestimonials, getAllTestimonials, createTestimonial, approveTestimonial, deleteTestimonial };
