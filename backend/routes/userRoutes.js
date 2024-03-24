const express = require('express')
const router = express.Router();
const {registerUser, loginUser, getMe} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')


router.post('/', registerUser) // Register users

router.post('/login', loginUser) //Login users

router.get('/me', protect,studentAuthentication,getMe)

module.exports = router