// tests/auth.test.js

const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const User = require('../models/User');

describe('Authentication Tests', () => {
    beforeAll(async () => {
        await User.deleteMany({}); // Clean up the database before tests
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                hospitalName: 'Test Hospital',
                hospitalId: 'HOSP123',
                location: 'Test Location',
                number: '1234567890',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toEqual('test@example.com');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
