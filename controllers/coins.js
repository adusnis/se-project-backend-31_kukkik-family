const { message } = require('statuses');
const User = require('../models/User')

// @desc    Get user's coin
// @route   GET /api/v1/coins
// @access  Public
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
// @route   GET /api/v1/getQR
// @access  Private
// exports.getQR = async (req, res, next) => {
//     const code = 
//     const qr = new QRCode({
//         text: url,
//         width: 100,
//         height: 100,
//         color: {
//             primary: '#000',
//             background: '#fff',
//             },
//             imageCallback: function (qrimg) {

// }


// @desc    Add coin to user's wallet
// @route   PUT /api/v1/coins/add
// @access  Public
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
// @access  Public
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