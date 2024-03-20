const express = require('express')
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')
const { adminAuthentication } = require("../middleware/authentication");
const {enrollCourse__controller} = require('../controllers/enrollmentController')


router.put("/enroll",protect,studentAuthentication,enrollCourse__controller)
router.get("/enrolled-students",protect,adminAuthentication,enrollCourse__controller)

module.exports = router