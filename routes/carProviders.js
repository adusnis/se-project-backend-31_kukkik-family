const express = require('express');
const router = express.Router();
const { getCarProviders, getCarProvider, createCarProvider, updateCarProvider, deleteCarProvider, likeCarProvider, getCarStatus, updateCarStatus, topSalesCar, getTopSalesCar, getAllRenterCars } = require('../controllers/carProviders');

const bookingRouter = require('./bookings');

const { protect, authorize } = require('../middleware/auth');

router.use('/:carProviderId/bookings/', bookingRouter);

router.route('/').get(getCarProviders).post(protect, authorize('admin', 'renter'), createCarProvider);
router.route('/top-sales').get(protect, authorize('admin', 'renter'), getTopSalesCar);
router.route('/renter/:renterId').get(getAllRenterCars);
router.route('/:id').get(getCarProvider).put(protect, authorize('admin'), updateCarProvider).delete(protect, authorize('admin'), deleteCarProvider);
router.route('/:id/like').post(protect, authorize('user', 'admin'), likeCarProvider);
// router.route('/:id/status')
//   .get(protect, authorize('user', 'admin'), getCarStatus) 
//   .put(protect, authorize('user', 'admin'), updateCarStatus);

module.exports = router;

/**
 * @swagger
 * /carProviders:
 *   get:
 *     tags: [Car Providers]
 *     summary: Get all car providers
 *     parameters:
 *       - in: query
 *         name: relevance
 *         schema:
 *           type: string
 *         description: Search term for relevance-based sorting
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: minprice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxprice
 *         schema:
 *           type: number
 *       - in: query
 *         name: minseat
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxseat
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders:
 *   post:
 *     tags: [Car Providers]
 *     summary: Create a new car provider
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarProvider'
 *     responses:
 *       201:
 *         description: Car provider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders/top-sales:
 *   get:
 *     tags: [Car Providers]
 *     summary: Get top sales cars
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 3
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders/renter/{renterId}:
 *   get:
 *     tags: [Car Providers]
 *     summary: Get all cars of a renter
 *     parameters:
 *       - in: path
 *         name: renterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 tel:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders/{id}:
 *   get:
 *     tags: [Car Providers]
 *     summary: Get a car provider by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders/{id}:
 *   put:
 *     tags: [Car Providers]
 *     summary: Update a car provider
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarProvider'
 *     responses:
 *       200:
 *         description: Car provider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CarProvider'
 */

/**
 * @swagger
 * /carProviders/{id}:
 *   delete:
 *     tags: [Car Providers]
 *     summary: Delete a car provider
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car provider deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /carProviders/{id}/like:
 *   post:
 *     tags: [Car Providers]
 *     summary: Like a car provider
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     carProvider:
 *                       $ref: '#/components/schemas/CarProvider'
 *                     message:
 *                       type: string
 */

/**
 * @swagger
 * /carProviders/{carProviderId}/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Add a new booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carProviderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - startDate
 *               - endDate
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 */