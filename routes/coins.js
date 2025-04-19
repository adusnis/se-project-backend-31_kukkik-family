const express = require('express')
const { getCoins, addCoins, deductCoins, redeemCoins, getQR, transferNetRevenue, getRedeemStatus } = require('../controllers/coins');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(protect, authorize('admin', 'user', 'renter'), getCoins)
router.route('/add').put(protect, authorize('admin', 'user', 'renter'), addCoins)
router.route('/deduct').put(protect, authorize('admin', 'user', 'renter'), deductCoins)
router.route('/getQR').post(protect, authorize('admin', 'user', 'renter'), getQR)
router.route('/confirm').put(protect, authorize('admin', 'user', 'renter'), transferNetRevenue, addCoins)
router.route('/redeem/:code').get(redeemCoins, addCoins)
router.route('/redeem/:code/status').get(getRedeemStatus)

module.exports = router;