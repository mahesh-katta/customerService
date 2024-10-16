const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('../src/utils/database'); // Adjust path as necessary
const customerRoutes = require('../src/routes/customerRoutes'); // Adjust path as necessary

const app = express();
app.use(express.json());
app.use('/api/customers', customerRoutes);

let server;

beforeAll(async () => {
    server = app.listen(3001);
    await connectDB(); // Ensure connection to the test database
});

afterAll(async () => {
    await mongoose.connection.close(); // Clean up the database connection
    server.close(); // Close server
});

describe('Customer API Tests', () => {
    const mockCustomer = {
        name: 'John Doe',
        address1: '123 Main St',
        state: 'CA',
        district: 'District 1',
        pin_code: '123456',
        contact_person: 'Jane Doe',
        mobile_no: '1234567890',
        email: 'john.doe@example.com',
    };

    test('GET /api/customers should return a greeting message', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('customerController is working fine'); // Adjusted to match actual response
    });

    test('POST /api/customers should create a new customer', async () => {
        const res = await request(app).post('/api/customers').send(mockCustomer);
        console.log('Response Body:', res.body); // Log for debugging
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toMatchObject(mockCustomer);
    });

    test('POST /api/customers/upload should upload customers from Excel file', async () => {
        const filePath= `${__dirname}/test.xlsx`;  // Ensure the path is valid
        console.log('Testing with Excel file:', filePath);

        const res = await request(app)
            .post('/api/customers/upload')
            .attach('file', filePath); // Attach your file for upload

        console.log('Upload Response:', res.body); // Log response for debugging
        expect(res.statusCode).toEqual(201); // Adjust this to the expected status code
    });
});