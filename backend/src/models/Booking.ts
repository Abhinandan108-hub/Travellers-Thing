import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  bookingDate: Date;
  travelDate: Date;
  numberOfTravellers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  specialRequests?: string;
  travellers: {
    name: string;
    age: number;
    passportNumber?: string;
  }[];
  contactInfo: {
    phone: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Package is required'],
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    numberOfTravellers: {
      type: Number,
      required: [true, 'Number of travellers is required'],
      min: [1, 'At least 1 traveller is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid',
    },
    specialRequests: { type: String },
    travellers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        passportNumber: { type: String },
      },
    ],
    contactInfo: {
      phone: { type: String, required: [true, 'Phone is required'] },
      email: { type: String, required: [true, 'Email is required'] },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export default Booking;