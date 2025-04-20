const request = require('supertest');
const mongoose = require('mongoose')
const { getRedeemStatus } = require('./../controllers/coins');
const User = require('../models/User');
const QrCode = require('../models/QrCode');

jest.mock('../models/User');
jest.mock('../models/QrCode');

describe('Get redeem code status scenario', () => {
    let req, res;

    const mockQrCode = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
        status: 'valid'
      };
      

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params : {
                code: '1112'
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        QrCode.findOne.mockResolvedValue(mockQrCode);
    });

    //Black Box
    
    test('Get redeem status should return redeem code status successfully', async () => {
        
        await getRedeemStatus(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            status: 'valid'
        });
    })

    test('Get redeem status should return 404 status if the redeem code does not exist', async () => {
        QrCode.findOne.mockResolvedValue(null);
        await getRedeemStatus(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: `There's no redeem code with code ${req.params.code}`
        });
    })

    test('Get redeem status should return 500 status if getCoins throws an error', async () => {
        QrCode.findOne.mockRejectedValue(new Error("Database failure"));
    
        await getRedeemStatus(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot get redeem status",
            error: "Database failure"
        });
    });
});