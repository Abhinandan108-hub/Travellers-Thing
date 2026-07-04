import mongoose, { Schema } from 'mongoose';
const bookingSchema = new Schema({
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
    { timestamps: true });
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
