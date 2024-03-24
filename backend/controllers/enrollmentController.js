const CourseEnrollmentModel = require('../models/CourseEnrollModel');
const CourseModel = require('../models/CourseModel');
const TimeTableModel = require('../models/TimetableModel');
const UserModel = require('../models/userModel');
const asyncHandler = require('express-async-handler');

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
         const { courseId } = req.query;

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

module.exports.deleteEnrolledStudents__contoller = asyncHandler(async (req, res) => {
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
  

  module.exports.viewTimeTable__controller = asyncHandler(async (req, res, next) => {

    try {

        console.log("viewTimeTable__controller started");

        const studentId  = req.user._id;

        console.log(studentId);

          // Find all course enrollments for the student
        const courseEnrollments = await CourseEnrollmentModel.find({ studentId });

        console.log(courseEnrollments);

        // Extract course IDs from course enrollments
        const courseIds = courseEnrollments.map(enrollment => enrollment.courseId);

        console.log(courseIds);

        const timetables = await TimeTableModel.find({ courseId: { $in: courseIds } })
        .populate({
            
            path: 'sessions',
            populate: [
                { path: 'LocationID', select: 'ID' }, // Selecting only the ID field
                { path: 'FacultyID' , select: 'Id' } // Assuming you want all fields for FacultyID
            ],
            select: 'sessiondate DayOfWeek startTime endTime SessionType LocationID FacultyID' // Select the fields you want to include
        }).populate({
            path:'courseId',
            select:'courseCode courseName'
        })
        .select('ID');

        console.log(timetables);

        return res.status(200).json({
            timetables,
          });

        
    } catch (error) {
        console.log(err);
      return res.status(400).json({
        error: "Something went wrong",
      });
        
    }

  });
  //await SessionModel.find({ _id: { $in: sessions } });