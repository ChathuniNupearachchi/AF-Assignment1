const CourseModel = require("../models/CourseModel");
const UserModel = require("../models/userModel");
const asyncHandler = require('express-async-handler')


module.exports.postCourse__controller = asyncHandler(async (req, res, next) => {
  try {
    const {courseCode,courseName, courseDescription, credits } = req.body;

    if (!courseCode || !courseName || !courseDescription ||!credits) {
      return res.status(400).json({
        error: "Please Provide All Information",
      });
    }

    const course = new CourseModel({
      courseCode,
      courseName,
      courseDescription,
      credits,
      createdBy: req.user._id,
    });
    course
      .save()
      .then((result) => {
        //console.log(result)
        return res.status(200).json({
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          error: "Something went wrong",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
});

module.exports.getCourses__controller = asyncHandler(async (req, res, next) => {
  try {
    const courses = await CourseModel.find()
    .populate(
       'faculty','name Id'
       // Populate only specific fields from the User model
    )
    .select('courseCode courseName courseDescription credits'); // Select all fields from the CourseModel
    return res.status(200).json({
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
});

module.exports.getOneCourse__controller = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const course = await CourseModel.findOne({ _id: courseId });
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
});

module.exports.deleteCourse__Controller = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.body;
    console.log(courseId)
    const course = await CourseModel.findOneAndDelete({ _id: courseId });
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
});

module.exports.assignFacultyToCourse__controller = asyncHandler(async (req, res, next) => {
  try {

    const { courseId, facultyId } = req.body;

    if (!courseId || !facultyId) {
      return res.status(400).json({
        error: "Please Provide All Information",
      });
    }
    
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const faculty = await UserModel.findById(facultyId);
    if (!faculty && faculty.role != 'Faculty') {
      return res.status(404).json({ error: 'User not found' });
    }

    course.faculty = faculty;

    await course.save();

    return res.status(200).json({ message: 'Faculty assigned successfully', course });



    
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
    
  }
});
