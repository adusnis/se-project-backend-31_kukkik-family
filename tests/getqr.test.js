const request = require('supertest');
const mongoose = require('mongoose')
const { getQR } = require('../controllers/coins');
const QrCodes = require('../models/QrCodes');
jest.mock('../models/QrCodes');

describe('Request QrCode scenario', ()=>{
    let req, res;

    const mockUser = {
        _id: '1', 
        save: jest.fn().mockResolvedValue(true),
      };
      
    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            user : {
                id : '1'
            },
            coin : {
                amount : 14
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
    });


});