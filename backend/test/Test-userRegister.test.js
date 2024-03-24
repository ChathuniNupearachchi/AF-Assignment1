const { registerUser } = require('../controller/userController');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

jest.mock('../models/userModel'); // Mock the User model

describe('registerUser', () => {
    it('should successfully register a new user', async () => {
        const req = { body: { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'Student' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mocking User.findOne to return null, indicating user does not exist
        User.findOne.mockResolvedValueOnce(null);

        // Mocking bcrypt.genSalt and bcrypt.hash to resolve with hashed password
        bcrypt.genSalt.mockResolvedValueOnce('salt');
        bcrypt.hash.mockResolvedValueOnce('hashedPassword');

        // Mocking User.create to resolve with newly created user
        User.create.mockResolvedValueOnce({
            id: 'userId123',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Student'
            // Mocking other properties as needed
        });

        // Mocking generateToken
        const mockToken = 'mockToken';
        const mockUserId = 'userId123';
        const mockUserRole = 'Student';
        const generateTokenMock = jest.fn().mockReturnValue(mockToken);

        const result = await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: mockUserId,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Student',
            token: mockToken
        });
    });

    it('should throw an error if required fields are missing', async () => {
        const req = { body: { name: 'John Doe', password: 'password123', role: 'Student' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Please include all fields' });
    });

    it('should throw an error if email is not valid', async () => {
        const req = { body: { name: 'John Doe', email: 'invalidemail', password: 'password123', role: 'Student' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email is not valid' });
    });

     
    
});
