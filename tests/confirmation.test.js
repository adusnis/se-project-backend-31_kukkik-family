const request = require('supertest');
const mongoose = require('mongoose')
const User = require('../models/User');
const QrCode = require('../models/QrCode');
const Booking = require('../models/Booking');
const CarProvider = require('../models/CarProvider');
const { addCoins, transferNetRevenue } = require('../controllers/coins');
 
jest.mock('../models/User');
jest.mock('../models/QrCode');
jest.mock('../models/Booking');

describe('Transfer coin to renter', () => {
    let req, res, next;

    const mockUser = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
    };

    const mockCarProvider = {
        dailyrate: 100
    };

    const mockBooking = {
        _id: '5',
        user: '1',
        carProvider: mockCarProvider  
    };
      

    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            user : {
                id : '1',
                role : 'user'
            },
            body : {
                bookingId : '5'
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn()

        User.findById.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockImplementation((id, update) => {
            mockUser.coin += update.$inc.coin;
            return mockUser;
        })

        Booking.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockBooking)
        });
    });

    //Black Box
    
    test('transfer net revenue should increase user coin amount correctly', async () => {
        
        await transferNetRevenue(req, res, next);

        await addCoins(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Coin added successfully',
            coin: 170
        });
    })

    test('transfer net revenue should return 401 status if user is not authorized to confirm the booking', async () => {
        
        req.user.id = '2'

        await transferNetRevenue(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'You are not authorized to confirm this booking'
        });
    })

    test('transfer net revenue should return 404 status if the booking does not exist', async () => {
        
        Booking.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });

        await transferNetRevenue(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Booking not found'
        });
    })

    test('transfer net revenue should return 400 status if there is no bookingId in request body', async () => {
        
        req.body.bookingId = '';
        
        await transferNetRevenue(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Invalid or missing booking ID'
        });
    })

    test('transfer net revenue should return 400 status if there is no bookingId in request body', async () => {
        
        req.body.bookingId = '';
        
        await transferNetRevenue(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Invalid or missing booking ID'
        });
    })

    test('transfer net revenue should return 500 status if getCoins throws an error', async () => {
        Booking.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error("Database failure"))
        });
    
        await transferNetRevenue(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot transfer coins from system to user",
            error: "Database failure"
        });
    });
});
