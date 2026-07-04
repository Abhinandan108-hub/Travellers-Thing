import mongoose, { Schema } from 'mongoose';
const packageSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Package title is required'],
        trim: true,
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Destination',
        required: [true, 'Destination is required'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: [300, 'Short description cannot exceed 300 characters'] },
    coverImage: { type: String, required: [true, 'Cover image is required'] },
    images: [{ type: String }],
    duration: { type: Number, required: [true, 'Duration is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    discountedPrice: { type: Number },
    groupSize: {
        min: { type: Number, default: 1 },
        max: { type: Number, default: 20 },
    },
    includes: [{ type: String }],
    excludes: [{ type: String }],
    itinerary: [
        {
            day: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
        },
    ],
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'challenging'],
        default: 'easy',
    },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
},
    { timestamps: true });
const Package = mongoose.model('Package', packageSchema);
export default Package;
