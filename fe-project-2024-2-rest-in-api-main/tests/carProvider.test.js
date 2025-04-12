const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const CarProvider = require('../models/CarProvider');

// Mock the CarProvider model
jest.mock('../models/CarProvider');

describe('CarProvider API Tests', () => {
    // Test data
    const testCarProviders = [
        {
            _id: '1',
            name: "Toyota Camry 2023",
            address: "123 Main St",
            district: "Downtown",
            province: "Bangkok",
            postalcode: "10100",
            tel: "0812345678",
            picture: "camry.jpg",
            dailyrate: 1500,
            seat: 5,
            like: 10,
            createdAt: new Date()
        },
        {
            _id: '2',
            name: "Honda Civic 2022",
            address: "456 Side St",
            district: "Chinatown",
            province: "Bangkok",
            postalcode: "10101",
            tel: "0823456789",
            picture: "civic.jpg",
            dailyrate: 1200,
            seat: 5,
            like: 15,
            createdAt: new Date()
        },
        {
            _id: '3',
            name: "Toyota Fortuner 2023",
            address: "789 Back St",
            district: "Sukhumvit",
            province: "Bangkok",
            postalcode: "10102",
            tel: "0834567890",
            picture: "fortuner.jpg",
            dailyrate: 2500,
            seat: 7,
            like: 20,
            createdAt: new Date()
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/carProviders - Filtering', () => {
        beforeEach(() => {
            CarProvider.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCarProviders)
            });
            CarProvider.countDocuments.mockResolvedValue(3);
        });

        test('should filter by province', async () => {
            const response = await request(app).get('/api/carProviders?province=Bangkok');
            expect(response.status).toBe(200);
            expect(CarProvider.find).toHaveBeenCalledWith(
                expect.objectContaining({ province: 'Bangkok' })
            );
        });

        test('should filter by multiple criteria simultaneously', async () => {
            const response = await request(app)
                .get('/api/carProviders?province=Bangkok&minprice=1000&maxprice=2000&minseat=5&maxseat=7');
            
            expect(response.status).toBe(200);
            expect(CarProvider.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    province: 'Bangkok',
                    dailyrate: {
                        $gte: 1000,
                        $lte: 2000
                    },
                    seat: {
                        $gte: 5,
                        $lte: 7
                    }
                })
            );
        });
    });

    describe('GET /api/carProviders - Sorting', () => {
        beforeEach(() => {
            CarProvider.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCarProviders)
            });
            CarProvider.countDocuments.mockResolvedValue(3);
        });

        test('should sort by relevance (text search)', async () => {
            const response = await request(app).get('/api/carProviders?relevance=Toyota');
            expect(response.status).toBe(200);
            expect(CarProvider.find).toHaveBeenCalledWith(
                expect.objectContaining({ $text: { $search: 'Toyota' } })
            );
            expect(CarProvider.find().sort).toHaveBeenCalledWith(
                expect.objectContaining({ score: { $meta: "textScore" } })
            );
        });

        test('should sort by likes (toplike=true)', async () => {
            const response = await request(app).get('/api/carProviders?toplike=true');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ like: -1 });
        });

        test('should sort by likes (toplike=false)', async () => {
            const response = await request(app).get('/api/carProviders?toplike=false');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ like: 1 });
        });

        test('should sort by seats (seat=high)', async () => {
            const response = await request(app).get('/api/carProviders?seat=high');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ seat: -1 });
        });

        test('should sort by seats (seat=low)', async () => {
            const response = await request(app).get('/api/carProviders?seat=low');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ seat: 1 });
        });

        test('should sort by price (price=high)', async () => {
            const response = await request(app).get('/api/carProviders?price=high');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ dailyrate: -1 });
        });

        test('should sort by price (price=low)', async () => {
            const response = await request(app).get('/api/carProviders?price=low');
            expect(response.status).toBe(200);
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ dailyrate: 1 });
        });
    });

    describe('GET /api/carProviders - Combined Filtering and Sorting', () => {
        beforeEach(() => {
            CarProvider.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCarProviders)
            });
            CarProvider.countDocuments.mockResolvedValue(3);
        });

        test('should combine filtering and sorting', async () => {
            const response = await request(app)
                .get('/api/carProviders?province=Bangkok&minprice=1000&maxprice=2000&seat=high');
            
            expect(response.status).toBe(200);
            expect(CarProvider.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    province: 'Bangkok',
                    dailyrate: {
                        $gte: 1000,
                        $lte: 2000
                    }
                })
            );
            expect(CarProvider.find().sort).toHaveBeenCalledWith({ seat: -1 });
        });
    });

    describe('GET /api/carProviders', () => {
        beforeEach(() => {
            // Mock the find method
            CarProvider.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCarProviders)
            });

            // Mock countDocuments
            CarProvider.countDocuments.mockResolvedValue(3);
        });

        test('should get all car providers without any filters', async () => {
            const response = await request(app).get('/api/carProviders');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(3);
            expect(CarProvider.find).toHaveBeenCalled();
        });

        test('should handle pagination', async () => {
            const response = await request(app).get('/api/carProviders?page=1&limit=2');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(CarProvider.find().skip).toHaveBeenCalledWith(0);
            expect(CarProvider.find().limit).toHaveBeenCalledWith(2);
        });

        test('should select specific fields', async () => {
            const response = await request(app).get('/api/carProviders?select=name,dailyrate');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(CarProvider.find().select).toHaveBeenCalledWith('name dailyrate');
        });
    });

    describe('GET /api/carProviders/:id', () => {
        beforeEach(() => {
            CarProvider.findById.mockResolvedValue(testCarProviders[0]);
        });

        test('should get a single car provider by id', async () => {
            const response = await request(app).get('/api/carProviders/1');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(CarProvider.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('POST /api/carProviders', () => {
        beforeEach(() => {
            CarProvider.create.mockResolvedValue(testCarProviders[0]);
        });

        test('should create a new car provider', async () => {
            const newCar = {
                name: "New Car",
                address: "New Address",
                district: "New District",
                province: "New Province",
                postalcode: "10103",
                tel: "0845678901",
                picture: "newcar.jpg",
                dailyrate: 1800,
                seat: 6
            };

            const response = await request(app)
                .post('/api/carProviders')
                .send(newCar);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(CarProvider.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...newCar,
                    like: 0
                })
            );
        });
    });

    describe('PUT /api/carProviders/:id', () => {
        beforeEach(() => {
            CarProvider.findByIdAndUpdate.mockResolvedValue(testCarProviders[0]);
        });

        test('should update a car provider', async () => {
            const updateData = {
                dailyrate: 2000
            };

            const response = await request(app)
                .put('/api/carProviders/1')
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(CarProvider.findByIdAndUpdate).toHaveBeenCalledWith(
                '1',
                updateData,
                expect.any(Object)
            );
        });
    });

    describe('DELETE /api/carProviders/:id', () => {
        beforeEach(() => {
            CarProvider.findById.mockResolvedValue(testCarProviders[0]);
            CarProvider.deleteOne.mockResolvedValue({ deletedCount: 1 });
        });

        test('should delete a car provider', async () => {
            const response = await request(app).delete('/api/carProviders/1');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(CarProvider.deleteOne).toHaveBeenCalledWith({ _id: '1' });
        });
    });
}); 