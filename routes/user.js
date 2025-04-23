const express = require('express');
const {getAllUsers,getUser, deleteUser, updateUser, getAllPendingRenterRegistrations} = require('../controllers/user');


const router=express.Router();

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect,authorize('admin'), getAllUsers)
router.route('/:id')
    .get(protect,authorize('admin'), getUser)
    .delete(protect,authorize('admin','user'), deleteUser)
    .put(protect,authorize('admin','user'), updateUser)
router.route('/renter-requests')
    .get(protect, authorize('admin'), getAllPendingRenterRegistrations)

module.exports = router;