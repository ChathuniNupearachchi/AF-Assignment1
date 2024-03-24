const express = require('express')
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')
const { adminAuthentication } = require("../middleware/authentication");
const {enrollCourse__controller,
    getEnrolledStudents__contoller,
    deleteEnrolledStudents__contoller,
    getEnrolledStudentsForCourse__contoller,
    viewTimeTable__controller
} = require('../controllers/enrollmentController')


router.put("/enroll",protect,studentAuthentication,enrollCourse__controller)
router.get("/enrolled-students",protect,adminAuthentication,getEnrolledStudents__contoller)
router.get("/enrolled-students-forcourse",protect,adminAuthentication,getEnrolledStudentsForCourse__contoller)
router.delete("/delete-enrolled-students",protect,adminAuthentication,deleteEnrolledStudents__contoller)

router.get("/view-my-timetables",protect,studentAuthentication,viewTimeTable__controller)
 

module.exports = router