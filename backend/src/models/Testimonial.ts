import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  user: mongoose.Types.ObjectId;
  package?: mongoose.Types.ObjectId;
  destination?: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  tripDate?: Date;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    tripDate: { type: Date },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
export default Testimonial;