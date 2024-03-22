const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')
const { adminAuthentication } = require("../middleware/authentication")

const {
    CreateTimetable__controller,
    AddSession__controller,
    AddResource__controller
} = require('../controllers/timetableController')


router.post("/create-timetable",protect,adminAuthentication,CreateTimetable__controller);

router.post("/add-session",protect,adminAuthentication,AddSession__controller);

router.post("/add-resources",protect,adminAuthentication,AddResource__controller)

module.exports = router;