// tests/accident.test.js

const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const Accident = require('../models/Accident');

describe('Accident Tests', () => {
    beforeAll(async () => {
        await Accident.deleteMany({}); // Clean up the database before tests
    });

    it('should create a new accident report', async () => {
        const res = await request(app)
            .post('/api/accident')
            .send({
                location: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716], // Example coordinates for an accident
                },
                description: 'Car accident at the junction',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('accident');
        expect(res.body.accident.description).toEqual('Car accident at the junction');
    });

    it('should retrieve all accident reports', async () => {
        const res = await request(app).get('/api/accident');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accidents');
        expect(res.body.accidents.length).toBeGreaterThan(0);
    });
});
