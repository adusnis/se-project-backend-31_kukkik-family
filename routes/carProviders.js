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
* components:
*   schemas:
*     CarProvider:
*       type: object
*       required:
*         - name
*         - address
*         - tel
*       properties:
*         name:
*           type: string
*           description: Car provider name
*         address:
*           type: string
*           description: House No., Street, Road
*         district:
*           type: string
*           description: District
*         province:
*           type: string
*           description: Province
*         postalcode:
*           type: string
*           description: 5-digit postal code
*         tel:
*           type: string
*           description: Telephone number
*       example:
*         name: Happy Car Provider
*         address: 121 ถ.สุขุมวิท
*         district: บางนา
*         province: กรุงเทพมหานคร
*         postalcode: 10110
*         tel: 02-2187000
*/

/**
* @swagger
* tags:
*   name: CarProviders
*   description: The car providers managing API
*/

/**
* @swagger
* /carProviders:
*   get:
*     summary: Returns the list of all the car providers
*     tags: [CarProviders]
*     responses:
*       200:
*         description: The list of the car providers
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/CarProvider'
*/

/**
* @swagger
* /carProviders/{id}:
*   get:
*     summary: Get the car provider by id
*     tags: [CarProviders]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The car provider id
*     responses:
*       200:
*         description: The car provider description by id
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CarProvider'
*       404:
*         description: The car provider was not found
*/

/**
* @swagger
* /carProviders:
*   post:
*     summary: Create a new car provider
*     tags: [CarProviders]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CarProvider'
*     responses:
*       201:
*         description: The car provider was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CarProvider'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /carProviders/{id}:
*   put:
*     summary: Update the car provider by the id
*     tags: [CarProviders]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The car provider id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CarProvider'
*     responses:
*       200:
*         description: The car provider was updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CarProvider'
*       404:
*         description: The car provider was not found
*       500:
*         description: Some error happened
*/

/**
* @swagger
* /carProviders/{id}:
*   delete:
*     summary: Remove the car provider by id
*     tags: [CarProviders]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The car provider id
*
*     responses:
*       200:
*         description: The car provider was deleted
*       404:
*         description: The car provider was not found
*/
