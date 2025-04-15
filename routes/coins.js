const express = require('express')
const { getCoins, addCoins, deductCoins, redeemCoins } = require('../controllers/coins');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router('/').get(protect, authorize('admin', 'user', 'renter'), getCoins)
router('/add').put(protect, authorize('admin', 'user', 'renter'), addCoins)
router('/deduct').put(protect, authorize('admin', 'user', 'renter'), deductCoins)
router('/redeem/:code').get(protect, authorize('admin', 'user', 'renter'), redeemCoins, addCoins)
    
module.exports = router;