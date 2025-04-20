const { message } = require('statuses');
const User = require('../models/User');
const QrCode = require('../models/QrCode');
const Booking = require('../models/Booking');
const crypto = require('crypto');
const QRCODE = require('../models/QrCode');
const status = require('statuses');

// @desc    Get user's coin
// @route   GET /api/v1/coins
// @access  Private
exports.getCoins = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user)
            return res.status(404).json({
                success: false,
                message: "Cannot fetch user"
            });

        res.status(200).json({
            success: true,
            coin: user.coin
        });

    } catch (err) {
        console.log(err);
        
        res.status(500).json({
            success: false,
            message: "Cannot fetch coins",
            error: err.message
        });
    }
};

// @desc    Gen QR code of API addCoins
// @route   POST /api/v1/coins/getQR
// @access  Private

exports.getQR = async (req, res, next) => {
    try {
        const user = req.user.id;
        const coin = req.body.coin;

        if (!coin) {
            return res.status(400).json({
                success: false,
                message: "Missing 'coin' in params"
            });
        }


        const code = crypto.randomBytes(16).toString('hex');

        const qrCode = new QrCode({
            code,
            user,
            coin,
            status: 'valid'
        });

        await qrCode.save();

        res.json({
            success: true,
            message: 'QR code generated successfully',
            qrCode: code
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Cannot generate QR code',
            error: err.message
        });
    }
};



// @desc    Add coin to user's wallet
// @route   PUT /api/v1/coins/add
// @access  Private
exports.addCoins = async (req, res, next) => {
    try {
        if(!req.body.coin)
            return res.status(400).json({
                success: false,
                message: "Coin value must be specified"
            })

        if(typeof req.body.coin !== 'number' || req.body.coin < 0)  
            return res.status(400).json({
                success: false,
                message: "Coin value must be a non-negative number"
            });
        
        let user = await User.findById(req.user.id);

        if(!user)
            return res.status(404).json({
                success: false,
                message: "Cannot fetch user"
            });
        


        user = await User.findByIdAndUpdate(req.user.id, {
           $inc: { coin: req.body.coin }, 
        }, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            message: "Coin added successfully",
            coin: user.coin
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot add coins",
            error: err.message
        });
    }
}

// @desc    Deduct coin from user's wallet
// @route   PUT /api/v1/coins/deduct
// @access  Private
exports.deductCoins = async (req, res, next) => {
    try {
        if(!req.body.coin)
            return res.status(400).json({
                success: false,
                message: "Coin value must be specified"
            })

        if(typeof req.body.coin !== 'number' || req.body.coin < 0)  
            return res.status(400).json({
                success: false,
                message: "Coin value must be a non-negative number"
            });
        
        let user = await User.findById(req.user.id);

        if(!user)
            return res.status(404).json({
                success: false,
                message: "Cannot fetch user"
            });

        if(user.coin < req.body.coin)
            return res.status(400).json({
                success: false,
                message: "Not enough coins to deduct"
            });

        user = await User.findByIdAndUpdate(req.user.id, {
           $inc: { coin: -req.body.coin }, 
        }, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            message: "Coin deducted successfully",
            coin: user.coin
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot deduct coins",
            error: err.message
        })
    }
}

// @desc    Redeem coin from code to user's wallet
// @route   GET /api/v1/coins/redeem/:code
// @access  Public
exports.redeemCoins = async (req, res, next) => {
    try {
        const redeemCode = req.params.code;

        let qrCode = await QrCode.findOne({ code: redeemCode}) 

        if(!qrCode)
            return res.status(404).json({
                success: false,
                message: `There's no redeem code with code ${redeemCode}`
            });
        
        req.user = {"id": qrCode.user};
        req.body = {"coin": qrCode.coin}
        
        if(new Date(qrCode.expiresAt).getTime() < Date.now())
            return res.status(400).json({
                success: false,
                message: 'The redeem code has expired'
            });
        

        if(qrCode.status !== 'valid')
            return res.status(400).json({
                success: false,
                message: `The redeem code is ${qrCode.status}`
            });

        await QrCode.findByIdAndUpdate(qrCode._id, {
                $set : {status: 'invalid'} 
            }, {
                runValidators: true
            });

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot redeem coins",
            error: err.message
        })
    }
}

// @desc    Redeem coin from code to user's wallet
// @route   PUT /api/v1/coins/confirm
// @access  Public
exports.transferNetRevenue = async (req, res, next) => {
    try {
        
        if (!req.body.bookingId ) 
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing booking ID'
            });

        const booking = await Booking.findById(req.body.bookingId).populate('carProvider');

        if(!booking)
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        
        if (booking.status !== 'received') {
            return res.status(400).json({ message: 'Booking status must be received' });
        }
  
        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') 
            return res.status(401).json({

                success: false,
                message: 'You are not authorized to confirm this booking'
            })
            
            
        const PLATFORM_FEE = 10;
        const price = booking.carProvider.dailyrate;
        const netAmount = price * (100 - PLATFORM_FEE) / 100 ; // calculate net revenue here
        
        req.body.coin = netAmount;

        next();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot transfer coins from system to user",
            error: err.message
        })
    }
}

// @desc    get redeem code status
// @route   GET /api/v1/coins/:code/status
// @access  Public
exports.getRedeemStatus = async (req, res, next) => {
    try {
        const qrCode = await QRCODE.findOne({ code: req.params.code});

        if(!qrCode)
            return res.status(404).json({
                success: false,
                message: `There's no redeem code with code ${req.params.code}`
            });

        res.status(200).json({
            success: true,
            status: qrCode.status
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Cannot get redeem status",
            error: err.message
        })
    }
};