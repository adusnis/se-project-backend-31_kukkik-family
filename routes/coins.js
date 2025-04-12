const express = require('express')
const { getCoins, addCoins, deductCoins } = require('../controllers/coins');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router('/')
    .get(protect, authorize('admin', 'user', 'renter'), getCoins)
    .post(protect, authorize('admin', 'user', 'renter'), addCoins)
    .get(protect, authorize('admin', 'user', 'renter'), deductCoins)
    
module.exports = router;