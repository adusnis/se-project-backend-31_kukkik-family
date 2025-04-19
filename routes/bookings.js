const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking, updateBookingStatus, getBookingStatus, getRenterBooking} = require('../controllers/bookings');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin', 'user'), getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);
router.route('/:id')
    .get(protect, getBooking)
    .put(protect, authorize('admin', 'user'),updateBooking)
    .delete(protect, authorize('admin', 'user'),deleteBooking);
router.route('/:id/status')
    .get(protect, authorize('user', 'admin'), getBookingStatus) 
    .patch(protect, authorize('user', 'admin'), updateBookingStatus);
router.route('/renter/:renterId/rentals')
    .get(protect, authorize('admin', 'user'), getRenterBooking);
  

module.exports=router;

