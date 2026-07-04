import Package from '../models/Package.js';
export const getPackages = async (query = {}, options = {}) => {
    const { skip = 0, limit = 10, sort = '-createdAt' } = options;
    const total = await Package.countDocuments(query);
    const data = await Package.find(query).populate('destination', 'name country coverImage').sort(sort).skip(skip).limit(limit);
    return { total, data };
};
export const getPackageById = async (id) => {
    return Package.findById(id).populate('destination', 'name country coverImage climate bestTimeToVisit');
};
export const createPackage = async (payload) => {
    return Package.create(payload);
};
export const updatePackage = async (id, updates) => {
    return Package.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
export const deletePackage = async (id) => {
    return Package.findByIdAndDelete(id);
};
export default { getPackages, getPackageById, createPackage, updatePackage, deletePackage };
