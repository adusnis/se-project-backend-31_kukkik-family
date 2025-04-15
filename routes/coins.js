const express = require('express')
const { getCoins, addCoins, deductCoins, redeemCoins } = require('../controllers/coins');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(protect, authorize('admin', 'user', 'renter'), getCoins)
router.route('/add').put(protect, authorize('admin', 'user', 'renter'), addCoins)
router.route('/deduct').put(protect, authorize('admin', 'user', 'renter'), deductCoins)
router.route('/redeem/:code').get(redeemCoins, addCoins)
    
module.exports = router;