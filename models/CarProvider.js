const mongoose = require('mongoose');

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
    renter: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    sale: {
        type: Number,
        default: 0
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CarProvider:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 50
 *         address:
 *           type: string
 *         district:
 *           type: string
 *         province:
 *           type: string
 *         postalcode:
 *           type: string
 *           maxLength: 5
 *         tel:
 *           type: string
 *           minLength: 3
 *           maxLength: 15
 *         picture:
 *           type: string
 *         dailyrate:
 *           type: number
 *         seat:
 *           type: number
 *           minimum: 1
 *         like:
 *           type: number
 *           default: 0
 *         renter:
 *           type: string
 *           format: objectId
 *         sale:
 *           type: number
 *           default: 0
 *       required:
 *         - name
 *         - address
 *         - district
 *         - province
 *         - postalcode
 *         - tel
 *         - picture
 *         - dailyrate
 *         - seat
 */
