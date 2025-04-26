const User = require('../models/User');
const { getAllPendingRenterRegistrations } = require('../controllers/user');

jest.mock('../models/User');
jest.mock('../models/QrCode');

describe('Get pending registration request scenario', () => {
    let req, res;
    let mockUser;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUser = {
            _id: '12',
            role: 'pending-renter',
            save: jest.fn().mockResolvedValue(true)
        }

        req = { }
        
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.find.mockResolvedValue(mockUser);
    });

    //Black Box
    
    test('Get all pending registration should return all user with pending-renter role successfully', async () => {
        
        await getAllPendingRenterRegistrations(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: mockUser.count,
            data: mockUser
        });
    })

    test('Get all pending registration should return empty data if there are no pending registration', async () => {
        mockUser = {};
        User.find.mockResolvedValue(null);

        await getAllPendingRenterRegistrations(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'There are no pending registration requests.',
            count: 0,
            data: []
        });
    })

    test('Get all pending registration should return status 500 if got any error', async () => {
        const mockError = new Error('Database failure');
        User.find.mockRejectedValue(mockError);
        
        await getAllPendingRenterRegistrations(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Cannot get all pending registration requests',
            error: mockError.message
        });
    })

});