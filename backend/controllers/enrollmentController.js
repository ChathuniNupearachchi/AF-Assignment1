const CourseEnrollmentModel = require('../models/CourseEnrollModel');
const CourseModel = require('../models/CourseModel');
const UserModel = require('../models/userModel');
const asyncHandler = require('express-async-handler')

module.exports.enrollCourse__controller = asyncHandler(async (req, res) => {
    try {
        const { courseCode } = req.body;
        const studentId = req.user._id; 

        // Check if the course exists
        const course = await CourseModel.findOne({courseCode : courseCode});
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const courseId = course._id;

        // Check if the student is already enrolled in the course
        const existingEnrollment = await CourseEnrollmentModel.findOne({ courseId, studentId });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'You are already enrolled in the course' });
        }

        let enrollmentCode;
        let newId;

        do {
            // Generate a random four-digit number
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            newId = "EN" + randomNum.toString();
        } while (await CourseEnrollmentModel.findOne({ enrollmentCode: newId })); // Check if the generated ID already exists

        enrollmentCode = newId;

        // Create a new enrollment
        const enrollment = new CourseEnrollmentModel({
            enrollmentCode,
            courseId,
            studentId
        });
        await enrollment.save();

        res.json({ message: 'Student enrolled in the course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports.getEnrolledStudents__contoller = asyncHandler(async (req, res) => {
    try {
         

        // Find all enrollments  
        const enrollments = await CourseEnrollmentModel.find().populate('courseId', 'courseName').populate('studentId', 'name');
        res.json({ enrollments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports.getEnrolledStudentsForCourse__contoller = asyncHandler(async (req, res) => {
    try {
         const { courseId } = req.params;

        //Find the course
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Find all enrollments for the specified course
        const enrollments = await CourseEnrollmentModel.find().populate('courseId', 'courseName').populate('studentId', 'name');
        res.json({ enrollments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports.deleteEnrolledStudents__contoller = asyncHandler(async (req, res, next) => {
    try {
      const { enrollmentId } = req.body;
      console.log(enrollmentId)
      const enrollment = await CourseEnrollmentModel.findOneAndDelete({ _id: enrollmentId });
      return res.status(200).json({
        enrollment,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
  });
  