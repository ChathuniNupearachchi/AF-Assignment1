const CourseModel = require("../models/CourseModel");
const User = require("../models/userModel")
const TimetableModel = require("../models/TimetableModel");
const ResourceModel = require("../models/ResourceModel");
const SessionModel = require("../models/SessionModel");
const asyncHandler = require('express-async-handler');


module.exports.CreateTimetable__controller = asyncHandler(async (req, res) => {

    try {
        const {courseId , facultyId} = req.body;

        // Check if the course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

         // Check if the faculty exists
        const faculty = await User.findById(facultyId);
        if (!faculty) {
            return res.status(404).json({ error: 'faculty not found' });
        }

        //Create new timetable
       const timetable = await TimetableModel.create({

        courseId,facultyId
         
       });

       if(timetable){
        res.status(201).json({
        _id:timetable._id,
        course: course.name,
        faculty: faculty.name,
        })
       } else{
       res.status(400)
       throw new error('Invalid user data')
 }

} catch (error) {
    console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});

module.exports.AddSession__controller = asyncHandler(async (req, res) => {


    const {date, DayOfWeek, startTime, endTime, SessionType, Location, Resource } = req.body;

    
    
    // Validate SessionType
    const validType =  ['Lecture','Lab','Tutorial'];
    if (!validType.includes(SessionType)) {
        res.status(400);
        throw new Error('Invalid type. Session Type must be one of Lecture,Lab,Tutorial');
    }

    const sessionDate = new Date(date);

    const currentDate = new Date(); // Get the current date

    // Check if sessionDate is today or a future date
    if (sessionDate < currentDate) {
        res.status(400);
        throw new Error('Invalid Date');
    }

    //Validate Day
    const DaysinWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    if(!DaysinWeek.includes(DayOfWeek)){
        res.status(400);
        throw new Error('Invalid Date');

    }

    // Check if the location exists
    const location = await ResourceModel.findById(Location);
    if (!location) {
        return res.status(404).json({ error: 'Location not found' });
    }

    // Check if the resource exists
    const resource = await ResourceModel.findById(Resource);
    if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
    }

    const startingTime = new Date(`${sessionDate}T${startTime}`);

    const endingTime = new Date(`${sessionDate}T${endTime}`);


})
