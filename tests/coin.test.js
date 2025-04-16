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

    test('GET coin should return 404 status if there is no user', async () => {
        User.findById.mockResolvedValue(null);

        await getCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Cannot fetch user'
        });
    });

    test('GET coin should return 500 status if getCoins throws an error', async () => {
        User.findById.mockRejectedValue(new Error("Database failure"));
    
        await getCoins(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot fetch coins",
            error: "Database failure"
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

    test('Add coin should return 404 status if there is no user', async () => {
        User.findById.mockResolvedValue(null);

        await addCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Cannot fetch user'
        });
    });

    test('Add coin should return 500 status if getCoins throws an error', async () => {
        User.findByIdAndUpdate.mockRejectedValue(new Error("Database failure"));
    
        await addCoins(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot add coins",
            error: "Database failure"
        });
    });
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

    test('Deduct coin should return 400 status if there is no coin field in the body', async () => {
        req.body = {};

        await deductCoins(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Coin value must be specified'
        });
    })

    test('Deduct coin should return 404 status if there is no user', async () => {
        User.findById.mockResolvedValue(null);

        await deductCoins(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Cannot fetch user'
        });
    });

    test('Deduct coin should return 500 status if getCoins throws an error', async () => {
        User.findById.mockRejectedValue(new Error("Database failure"));
    
        await deductCoins(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot deduct coins",
            error: "Database failure"
        });
    });
})

describe('Redeem coin with phone scenario', () => {
    let req, res, next;
    let mockQrCode;

    const mockUser = {
        _id: '1', 
        coin: 100, 
        save: jest.fn().mockResolvedValue(true),
      };

    
    
    beforeEach(() => {
        jest.clearAllMocks();

        mockQrCode = {
            code: "f0133567-1f5a-44a7-ad61-f33cee8c0624",
            user: "1",
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            status: "valid",
            coin: 21
        };

        req = {
            params: {
                code: mockQrCode.code
            }
        }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        QrCode.findOne.mockResolvedValue(mockQrCode);
        QrCode.findByIdAndUpdate.mockResolvedValue(mockQrCode);

        User.findById.mockResolvedValue(mockUser);
        User.findByIdAndUpdate.mockImplementation((id, update) => {
            mockUser.coin += update.$inc.coin;
            return mockUser;
        })

    });

    test('Redeem coin should add coin to user successfully', async () => {

        await redeemCoins(req, res, next);
        
        await addCoins(req, res);

        expect(next).toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Coin added successfully',
            coin: 121
        });
    })

    test('Redeem coin should return 404 status if redeem code does not exist', async () => {
        req.params.code = '24211'

        QrCode.findOne.mockResolvedValue(null);

        await redeemCoins(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: `There's no redeem code with code ${req.params.code}`
        });
    });

    test('Redeem coin should return 400 status if redeem code status is invalid', async () => {
        mockQrCode.status = 'invalid'

        await redeemCoins(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: `The redeem code is ${mockQrCode.status}`
        });
    });

    test('Redeem coin should return 400 status if redeem code status is invalid', async () => {
        mockQrCode.expiresAt = new Date(Date.now() - 5 * 60 * 1000);

        await redeemCoins(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: `The redeem code has expired`
        });
    });

    test('Redeem coin should return 500 status if redeemCoins throws an error', async () => {
        // Force QrCode.findOne to throw an error
        QrCode.findOne.mockRejectedValue(new Error("Database failure"));
    
        await redeemCoins(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot redeem coins",
            error: "Database failure"
        });
    });

    test('Redeem coin should return 500 status if getCoins throws an error', async () => {
        QrCode.findOne.mockRejectedValue(new Error("Database failure"));
    
        await redeemCoins(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Cannot redeem coins",
            error: "Database failure"
        });
    });
});