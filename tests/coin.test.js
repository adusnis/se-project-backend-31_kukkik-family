const request = require('supertest');
const mongoose = require('mongoose')
const { addCoins, getCoins, deductCoins, redeemCoins } = require('./../controllers/coins');
const User = require('../models/User');
const QrCode = require('../models/QrCode');

jest.mock('../models/User');
jest.mock('../models/QrCode');

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

    test('Deduct coin should deduct user coin successfully', async () => {
        req.body = { coin: 50};

        await deductCoins(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Coin deducted successfully',
            coin: 50
        });
    })

    test('Deduct coin should return 400 status if the coin deducting is negative', async () => {

        req.body = { coin: -50 };

        await deductCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Coin value must be a non-negative number'
        });
    })

    test("Deduct coin should return 400 status if the coin deducting is more than user's coin", async () => {
        
        req.body = { coin: 5000 };

        await deductCoins(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not enough coins to deduct'
        });

    })
})

describe('Redeem coin with phone scenario', () => {
    let req, res;

    const mockUser = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
      };

    const mockQrCode = {
        "code": "f0133567-1f5a-44a7-ad61-f33cee8c0624",
        "user": "1",
        "createdAt": "2025-04-15T13:08:07.298275",
        "expiresAt": "2025-04-15T13:13:07.298290",
        "status": "valid",
        "coin": 21
    };
    
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        req = {
            params: {
                code: mockQrCode.code
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        QrCode.findOne.mockResolvedValue(mockQrCode);
        User.findById.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockImplementation((id, update) => {
            mockUser.coin += update.$inc.coin;
            return mockUser;
        })

    });

    test('Redeem coin should add coin to user successfully', async () => {

        await redeemCoins(req, res, async () =>{

            await addCoins(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Coin added successfully',
                coin: 121
            });
        });
    })
});