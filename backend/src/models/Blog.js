import mongoose, { Schema } from 'mongoose';
const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Blog title is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    content: {
        type: String,
        required: [true, 'Blog content is required'],
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required'],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required'],
    },
    tags: [{ type: String, lowercase: true }],
    category: {
        type: String,
        enum: ['travel-tips', 'destination-guide', 'adventure', 'food', 'culture', 'budget-travel', 'luxury', 'solo-travel'],
        required: [true, 'Category is required'],
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
},
    { timestamps: true });
// Auto-generate slug from title
blogSchema.pre('save', function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') + '-' + Date.now();
    }
    if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});
const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
