const User = require('../models/User');
const Booking = require('../models/Booking');
//const CarProvider = require('../models/CarProvider');

exports.getAllUsers = async (req, res, next) => {
    try {
        //Fetch users and populate their bookings + carProvider details
        const users = await User.find()
            .populate({
                path: 'booking', 
                populate: {
                    path: 'carProvider', 
                    select: 'name address tel'
                }
            });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Cannot fetch users",
            error: err.message
        });
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'booking', 
            populate: {
                path: 'carProvider', 
                select: 'name address tel'
            }
        });
        if(!user)
        {
            return res.status(400).json({success: false, msg:'User id does not exist'});
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Cannot fetch users",
            error: err.message
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
            const user = await User.findById(req.params.id);
            console.log(user);
            if (!user) {
                return res.status(400).json({ success: false });
            }
            if(req.user.role == 'user')
            {
                if(req.params.id != req.user.id){
                    return res.status(400).json({
                        success: false,
                        msg: 'user cannot delete other'
                    });
                }
            }
            if(req.params.id == req.user.id){
                console.log('self deleted');
            }
            await Booking.deleteMany({ user: req.params.id });
            await User.deleteOne({ _id: req.params.id });
            res.status(200).json({
                success: true,
                data: {}
            });
    } catch (err) {
        res.status(400).json({ success: false});
    }
};
exports.updateUser = async (req, res, next) => {
    try {
            let user = await User.findById(req.params.id);
            console.log(user);
            if (!user) {
                return res.status(400).json({ success: false });
            }
            if(req.user.role == 'user')
            {
                if(req.params.id != req.user.id){
                    return res.status(400).json({
                        success: false,
                        msg: 'user cannot update other'
                    });
                }
            }
            if(req.params.id == req.user.id){
                console.log('self edit');
            }
            user = await User.findByIdAndUpdate(req.params.id, req.body, {
                        new: true,
                        runValidators: true
            });
            res.status(200).json({
                success: true,
                data: user
            });
    } catch (err) {
        res.status(400).json({ success: false});
    }
};

