const {
  postCourse__controller,
  getCourses__controller,
  getOneCourse__controller,
  deleteCourse__Controller,
  assignFacultyToCourse__controller,
} = require("../controllers/courseController");
const { adminAuthentication } = require("../middleware/authentication");
const {protect} = require('../middleware/authMiddleware')
const router = require("express").Router();


router.post(
  "/post-course",
  protect,
  adminAuthentication,
  postCourse__controller
);

router.get("/get-courses",protect, getCourses__controller);

router.get("/get-course/:courseId", protect, getOneCourse__controller)

router.delete('/delete',protect,adminAuthentication,deleteCourse__Controller)

router.post("/assign-faculty",protect,adminAuthentication,assignFacultyToCourse__controller);

module.exports = router;
