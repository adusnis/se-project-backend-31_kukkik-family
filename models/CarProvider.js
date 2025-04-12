const mongoose = require('mongoose');
const status = require('statuses');

const CarProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength: [5, 'Name can not be more than 5 digits']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        minlength: [3, 'Telephone number must be at least 3 characters long'],
        maxlength: [15, 'Telephone number cannot exceed 15 characters']
    },
    picture: {
        type: String,
        required: [true, 'Please add a picture']
    },
    dailyrate: {
        type: Number,
        required: [true, 'Please add a daily rate'],
    },
    seat: {
        type: Number,
        required: [true, 'Please add a seat number'],
        min: [1, 'Seat number must be at least 1']
    },
    like: {
        type: Number,
        required: [false, 'Please add a like number'],
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'received', 'returned'],
        default: 'available'
    },
    renter: {
        type: Schema.Types.ObjectId,
        ref: 'Renter',
    }
}
,{
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
});

CarProviderSchema.index({ name: 'text' });

CarProviderSchema.virtual('booking',{
    ref:'Booking',
    localField:'_id',
    foreignField:'carProvider',
    justOne:false
})
module.exports = mongoose.model('CarProvider', CarProviderSchema);