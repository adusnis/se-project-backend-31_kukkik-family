const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const RenterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please add a name']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        minlength: [3, 'Telephone number must be at least 3 characters long'],
        maxlength: [15, 'Telephone number cannot exceed 15 characters']
    },
    email:{
        type:String,
        required:[true, 'Please add an email'],
        unique:true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email'
        ]
    },
    password:{
        type:String,
        required:[true, 'Please add a password'],
        minlength:6,
        select:false
    },
    role:{
        type:String,
        default:'renter'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    rentalCars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CarProvider'
    }],
    createAt:{
        type:Date,
        default:Date.now
    },
    coin: {
        type: Number,
        required: true,
        min: [0, 'Coin must be a non-negative number'],
        default: 0
    }

});

//Encrypt password using bcrypt
RenterSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});

//Sign JWT and return
RenterSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

//Match password
RenterSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

RenterSchema.set('toJSON', { virtuals: true });
RenterSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Renter', RenterSchema);