const express = require('express');
const router = express.Router();
const {
    createNotice__controller,
    getNotices__controller
} = require('../controllers/noticesController');

const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')
const { adminAuthentication } = require("../middleware/authentication");


router.post('/create-notices',protect,adminAuthentication,createNotice__controller);
router.get('/view-notices',protect,studentAuthentication,getNotices__controller);
