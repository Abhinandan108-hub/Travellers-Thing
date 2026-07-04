import Blog from '../models/Blog.js';
export const getBlogs = async (query = {}, options = {}) => {
    const { skip = 0, limit = 10, sort = '-publishedAt' } = options;
    const total = await Blog.countDocuments(query);
    const data = await Blog.find(query).populate('author', 'name avatar').sort(sort).skip(skip).limit(limit);
    return { total, data };
};
export const getBlogBySlug = async (slug) => {
    return Blog.findOneAndUpdate({ slug, isPublished: true }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name avatar');
};
export const createBlog = async (payload) => {
    return Blog.create(payload);
};
export const updateBlog = async (id, updates) => {
    return Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
export const deleteBlog = async (id) => {
    return Blog.findByIdAndDelete(id);
};
export default { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
