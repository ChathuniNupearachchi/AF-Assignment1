const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {studentAuthentication} = require('../middleware/authentication')
const {adminAuthentication} = require("../middleware/authentication")
const {resourceAvailability} = require("../middleware/resourceAvailability")
const {locationAvailability} = require("../middleware/locationAvailabilty")
const {sessionValidation} = require("../middleware/sessionValidation")

const {
    
    CreateTimetable__controller,
    getTimetables_controller,
    AddSession__controller,
    AddResource__controller,
    getResources__controller,
    AddLocation__controller,
    getLocations__controller,
    removeSession,
    UpdateSessionController,

} = require('../controllers/timetableController')




router.post("/create-timetable",protect,adminAuthentication,CreateTimetable__controller);
router.get("/get-timetables",protect,adminAuthentication,getTimetables_controller)

router.post("/add-session",protect,sessionValidation,adminAuthentication,locationAvailability,resourceAvailability,AddSession__controller);
router.delete("/delete-session",protect,adminAuthentication,removeSession);
router.put("/update-session",protect,adminAuthentication,UpdateSessionController)



router.post("/add-resources",protect,adminAuthentication,AddResource__controller);
router.get("/get-resources",protect,adminAuthentication,getResources__controller);

router.post("/add-location",protect,adminAuthentication,AddLocation__controller);
router.get("/get-locations",protect,adminAuthentication,getLocations__controller);




module.exports = router;