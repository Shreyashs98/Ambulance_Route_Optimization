// tests/ambulance.test.js

const request = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const Ambulance = require('../models/Ambulance');

describe('Ambulance Tests', () => {
    beforeAll(async () => {
        await Ambulance.deleteMany({}); // Clean up the database before tests
    });

    it('should create a new ambulance', async () => {
        const res = await request(app)
            .post('/api/ambulance')
            .send({
                numberPlate: 'AB-123-CD',
                location: {
                    type: 'Point',
                    coordinates: [77.5946, 12.9716], // Example coordinates for Bangalore
                },
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('ambulance');
        expect(res.body.ambulance.numberPlate).toEqual('AB-123-CD');
    });

    it('should retrieve all ambulances', async () => {
        const res = await request(app).get('/api/ambulance');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('ambulances');
        expect(res.body.ambulances.length).toBeGreaterThan(0);
    });
});
