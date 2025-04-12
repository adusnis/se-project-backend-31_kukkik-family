const request = require('supertest');
const mongoose = require('mongoose')
const { addCoins, getCoins } = require('./../controllers/coins');
const User = require('../models/User');

jest.mock('../models/User');

describe('Get coin scenario', ()=>{
    let req, res;

    const mockUser = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
      };
      

    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            user : {
                id : '1'
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    });
    
    test('GET coin should show coins successfully', async () => {
        User.findById.mockResolvedValue(mockUser);

        await getCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            coin: 100
        });
    })


});

describe('Add coin scenario', () => {
    let req, res;

    const mockUser = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
      };
      

    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            user : {
                id : '1'
            },
            coin : 50
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    });

    test('Add coin should increase user coin amount correctly', async () => {
        User.findById.mockResolvedValue(mockUser);

        await addCoins(req, res);
        
        expect(mockUser.coin).toBe(150);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Adding coin successfully'
        });
    })

    test('Add coin should return 400 status if the coin to add is negative', async () => {
        User.findById.mockResolvedValue(mockUser);

        req.body = { coin: -50 };

        await addCoins(req, res);
        
        expect(mockUser.coin).toBe(100);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Coin balance cannot be negative'
        });
    })


});