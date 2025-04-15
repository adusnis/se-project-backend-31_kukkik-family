const mongoose = require('mongoose');

// code, createdAt, expiresAt, status, user
const QrCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Code is required'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // add 5 minutes
    },
    status: {
        type: String,
        enum: ['valid', 'invalid'],
        default: 'valid'
    },
    coin: {
        type: Number,
        required: true,
        min: 0,
    }
});

module.exports = mongoose.model('QrCode', QrCodeSchema);
