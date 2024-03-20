const express = require('express')
const router = express.Router();
const {registerUser, loginUser, getMe} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')


router.post('/', registerUser)

router.post('/login', loginUser)

router.get('/me', protect,studentAuthentication,getMe)

module.exports = router