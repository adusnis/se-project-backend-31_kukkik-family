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
    });


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
            body : {
                coin : 50
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findById.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockImplementation((id, update) => {
            mockUser.coin += update.$inc.coin;
            return mockUser;
        })

    });

    //Black Box
    
    test('Add coin should increase user coin amount correctly', async () => {
        
        await addCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Coin added successfully',
            coin: 150
        });
    })

    test('Add coin should return 400 status if the coin adding is negative', async () => {

        req.body = { coin: -50 };

        await addCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Coin value must be a non-negative number'
        });
    })

    test('Add coin should return 400 status if there is no coin field in the body', async () => {
        req.body = {};

        await addCoins(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Coin value must be specified'
        });
    })

    //White Box
});

describe('Deduct coin scenario', () => {

})