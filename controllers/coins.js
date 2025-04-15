const { message } = require('statuses');
const User = require('../models/User');
const QrCode = require('../models/QrCode');

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
// @route   PUT /api/v1/coins/deduct
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