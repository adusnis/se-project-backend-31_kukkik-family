jest.mock('../models/QrCode'); // mock module ที่ถูกต้อง

const QrCode = require('../models/QrCode'); // เรียกใช้ตัวเดียวกับที่ mock
const { getQR } = require('./../controllers/coins');
describe('getQR', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // รีเซ็ต mock ก่อนแต่ละเทสต์
    });

    it('should generate QR code successfully', async () => {
        const saveMock = jest.fn();
        QrCode.mockImplementation(() => ({
            save: saveMock
        }));
    
        const req = {
            user: { id: '6733271021' },
            body :{
                    coin: 5000
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        QrCode.mockImplementation(() => ({
            save: jest.fn()
        }));

        await getQR(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                qrCode: expect.any(String)
            })
        );
    });

    it('should return 500 on save error', async () => {
        const req = {
            user: { id: '6733271021' },
            body: {
                    coin: 5000
            }
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        QrCode.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('DB Error'))
        }));

        await getQR(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: 'Cannot generate QR code'
            })
        );
    });

    it('should return 400 on missing coin in params', async () => {
        const saveMock = jest.fn();
        QrCode.mockImplementation(() => ({
            save: saveMock
        }));
    
        const req = {
            user: { id: '6733271021' },
            body :{}
        };

        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        QrCode.mockImplementation(() => ({
            save: jest.fn()
        }));

        await getQR(req, res);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: "Missing 'coin' in params"
            })
        );
    });
});
