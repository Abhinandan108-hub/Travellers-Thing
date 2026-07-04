import mongoose, { Schema } from 'mongoose';
const destinationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Destination name is required'],
        trim: true,
        unique: true,
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    images: [{ type: String }],
    coverImage: {
        type: String,
        required: [true, 'Cover image is required'],
    },
    category: {
        type: String,
        enum: ['beach', 'mountain', 'city', 'desert', 'forest', 'cultural', 'adventure', 'luxury'],
        required: [true, 'Category is required'],
    },
    highlights: [{ type: String }],
    bestTimeToVisit: { type: String },
    climate: { type: String },
    isPopular: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
},
    { timestamps: true });
const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
