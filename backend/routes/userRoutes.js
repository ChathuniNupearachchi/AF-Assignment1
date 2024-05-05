const express = require('express')
const router = express.Router();
const {registerUser, loginUser, getMe , logoutUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')


router.post('/', registerUser) // Register users

router.post('/login', loginUser) //Login users

router.get('/me', protect,studentAuthentication,getMe)

router.post('/logout', logoutUser) //Logout users


module.exports = router