const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User');
const Booking = require('../models/Booking');

describe('User Controller Tests', () => {
    let user1, user2, adminUser;
    let user1Token, adminToken;

    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.MONGO_URI);
    });

    beforeEach(async () => {
        // Clear all collections
        await User.deleteMany({});
        await Booking.deleteMany({});

        // Create test users
        user1 = await User.create({
            name: 'Test User 1',
            email: 'test1@example.com',
            password: '123456',
            tel: '1234567890',
            role: 'user'
        });

        user2 = await User.create({
            name: 'Test User 2',
            email: 'test2@example.com',
            password: '123456',
            tel: '0987654321',
            role: 'user'
        });

        adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123456',
            tel: '1111111111',
            role: 'admin'
        });

        // Create test bookings
        await Booking.create({
            user: user1._id,
            carProvider: new mongoose.Types.ObjectId(),
            startDate: new Date(),
            endDate: new Date(),
            status: 'pending'
        });

        // Get tokens
        user1Token = user1.getSignedJwtToken();
        adminToken = adminUser.getSignedJwtToken();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('getAllUsers', () => {
        it('should get all users with their bookings and car provider details', async () => {
            getAll

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(3);
            expect(res.body.data).toHaveLength(3);
            expect(res.body.data[0].booking).toBeDefined();
        });

        it('should handle error when fetching users fails', async () => {
            // Mock User.find() to throw an error
            jest.spyOn(User, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .get('/api/v1/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Cannot fetch users');
        });
    });

    describe('getUser', () => {
        it('should get a single user by ID with bookings and car provider details', async () => {
            const res = await request(app)
                .get(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id.toString()).toBe(user1._id.toString());
            expect(res.body.data.booking).toBeDefined();
        });

        it('should return 400 if user does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/v1/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.msg).toBe('User id does not exist');
        });

        it('should handle error when fetching user fails', async () => {
            jest.spyOn(User, 'findById').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            const res = await request(app)
                .get(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Cannot fetch users');
        });
    });

    describe('deleteUser', () => {
        it('should allow admin to delete any user', async () => {
            const res = await request(app)
                .delete(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({});

            // Verify user is deleted
            const deletedUser = await User.findById(user1._id);
            expect(deletedUser).toBeNull();
        });

        it('should allow user to delete themselves', async () => {
            const res = await request(app)
                .delete(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual({});

            // Verify user is deleted
            const deletedUser = await User.findById(user1._id);
            expect(deletedUser).toBeNull();
        });

        it('should not allow user to delete other users', async () => {
            const res = await request(app)
                .delete(`/api/v1/users/${user2._id}`)
                .set('Authorization', `Bearer ${user1Token}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.msg).toBe('user cannot delete other');
        });

        it('should return 400 if user does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .delete(`/api/v1/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('updateUser', () => {
        it('should allow admin to update any user', async () => {
            const updateData = {
                name: 'Updated Name',
                tel: '9999999999'
            };

            const res = await request(app)
                .put(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(updateData.name);
            expect(res.body.data.tel).toBe(updateData.tel);
        });

        it('should allow user to update themselves', async () => {
            const updateData = {
                name: 'Updated Name',
                tel: '9999999999'
            };

            const res = await request(app)
                .put(`/api/v1/users/${user1._id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(updateData);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(updateData.name);
            expect(res.body.data.tel).toBe(updateData.tel);
        });

        it('should not allow user to update other users', async () => {
            const updateData = {
                name: 'Updated Name',
                tel: '9999999999'
            };

            const res = await request(app)
                .put(`/api/v1/users/${user2._id}`)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(updateData);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.msg).toBe('user cannot update other');
        });

        it('should return 400 if user does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const updateData = {
                name: 'Updated Name',
                tel: '9999999999'
            };

            const res = await request(app)
                .put(`/api/v1/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send(updateData);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });
});
