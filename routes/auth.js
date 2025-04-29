const express=require('express');

const {register, login, getMe, logout , deleteUser}=require('../controllers/auth');

const router=express.Router();

const {protect}=require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout', logout);

module.exports=router;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 tel:
 *                   type: string
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 tel:
 *                   type: string
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current logged in user
 *     security:
 *       - bearerAuth: []
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
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "680fd2e7372f68a45855b2da"
 *                     name:
 *                       type: string
 *                       example: "000001"
 *                     tel:
 *                       type: string
 *                       example: "000001"
 *                     email:
 *                       type: string
 *                       example: "000001@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     likedCars:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     selfiePicture:
 *                       type: string
 *                       example: "string"
 *                     coin:
 *                       type: integer
 *                       example: 0
 *                     rentalCars:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-28T19:11:35.630Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     id:
 *                       type: string
 *                       example: "680fd2e7372f68a45855b2da"
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */