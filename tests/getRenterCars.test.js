const { getRenterBooking } = require('../controllers/bookings');
const Booking = require('../models/Booking');
const QrCode = require('../models/QrCode');

jest.mock('../models/Booking');

describe(`Get all renter's booking`, () => {
    let req, res;
    let mockBooking, mockCarProvider;

    mockCarProvider = {
        name: 'John',
        renter: '3412'
    }

    beforeEach(() => {
        jest.clearAllMocks();

        mockBooking = {
            _id: '1',
            carProvider: mockCarProvider,
            save: jest.fn().mockResolvedValue(true)
        };

        req = {
            user : {
                id: '3412'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        //Booking.find().mockResolvedValue([mockBooking]);
        Booking.find = jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockBooking)
        });
    });
    
    test(`Get all renter should return all renter's booking successfully`, async () => {

        await getRenterBooking(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('Get all renter should return empty data if the renter does not have any booking', async () => {
        mockBooking.carProvider = {};

        await getRenterBooking(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});