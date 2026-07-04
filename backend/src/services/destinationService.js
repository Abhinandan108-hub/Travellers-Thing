import Destination from '../models/Destination.js';
export const getDestinations = async (query = {}, options = {}) => {
    const { skip = 0, limit = 10, sort = '-createdAt' } = options;
    const total = await Destination.countDocuments(query);
    const data = await Destination.find(query).sort(sort).skip(skip).limit(limit);
    return { total, data };
};
export const getDestinationById = async (id) => {
    return Destination.findById(id);
};
export const createDestination = async (payload) => {
    return Destination.create(payload);
};
export const updateDestination = async (id, updates) => {
    return Destination.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
export const deleteDestination = async (id) => {
    return Destination.findByIdAndDelete(id);
};
export default { getDestinations, getDestinationById, createDestination, updateDestination, deleteDestination };
