const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    carProvider: {
        type: mongoose.Schema.ObjectId,
        ref: 'CarProvider',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 🔥 Move endDate validation to a pre-hook
BookingSchema.pre('validate', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('End date must be after start date.'));
    }
    next();
});

// ✅ Ensure no duplicate bookings for the same carProvider in overlapping dates
BookingSchema.index({ carProvider: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
