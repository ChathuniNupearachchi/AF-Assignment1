const { loginUser } = require('../controller/userController');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');

jest.mock('../model/userModel'); // Mock the User model

describe('loginUser', () => {
    it('should return a JWT token if email and password are correct', async () => {
        const req = { body: { email: 'test@example.com', password: 'password123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock the User.findOne method
        User.findOne.mockResolvedValueOnce({ 
            email: 'test@example.com', 
            password: await bcrypt.hash('password123', 10)
        });

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: expect.any(String) });
    });

    it('should return an error if user does not exist', async () => {
        const req = { body: { email: 'nonexistentuser', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock the User.findOne method to return null
        User.findOne.mockResolvedValueOnce(null);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    

    
});
