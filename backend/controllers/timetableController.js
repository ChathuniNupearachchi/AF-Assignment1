const CourseModel = require("../models/CourseModel");
const User = require("../models/userModel")
const TimetableModel = require("../models/TimetableModel");
const ResourceModel = require("../models/ResourceModel");
const SessionModel = require("../models/SessionModel");
const ResourceBookingModel = require("../models/ResourceBookingModel");
const LocationBookingModel = require('../models/LocationBookingModel');
const CourseEnrollmentModel = require('../models/CourseEnrollModel');
const LocationModel = require("../models/LocationModel");
const sendEmail = require('../services/emailServices'); // Import your email service utility
const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');

module.exports.CreateTimetable__controller = asyncHandler(async (req, res) => {

    try {
        const {courseCode} = req.body;

        // Check if the course exists
        const course = await CourseModel.findOne({courseCode:courseCode});
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }


        let newId;
    
        do {
            // Generate a random four-digit number
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            newId = "T" + randomNum.toString();
        } while (await TimetableModel.findOne({ ID: newId })); // Check if the generated ID already exists
        
        const ID = newId; 

        const courseId = course._id;

        //Create new timetable
       const timetable = await TimetableModel.create({

        courseId,ID
         
       });

       if(timetable){
        res.status(201).json({
        TimeTableID:timetable.ID,
        course: course.courseName,
         
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

module.exports.getTimetables_controller = asyncHandler(async (req, res, next) => {
    try {
      const timetables = await TimetableModel.find()
      .populate(
         'courseId','courseCode courseName'
         // Populate only specific fields from the User model
      )
      .select('ID'); // Select all fields from the CourseModel
      return res.status(200).json({
        timetables,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
  });

module.exports.AddSession__controller = asyncHandler(async (req, res) => {

    try{

    const {sessiondate, DayOfWeek, startTime, endTime, SessionType, Location, Resource,Faculty, TimeTable } = req.body;

    //Validation
    if(!sessiondate || !DayOfWeek || !startTime || !endTime || !SessionType || !Location || !Resource ||!Faculty ||!TimeTable ){
        res.status(400)
        throw new Error('Please include all fields')
       }
   

    
    
    // Validate SessionType
    const validType =  ['Lecture','Lab','Tutorial'];
    if (!validType.includes(SessionType)) {
        res.status(400);
        throw new Error('Invalid type. Session Type must be one of Lecture,Lab,Tutorial');
    }

    const currentDate = DateTime.now().toISODate();

    const sessionDate = DateTime.fromISO(sessiondate).toISODate(); // Get the current date

    console.log(sessionDate);
    console.log(currentDate);

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
    const location = await LocationModel.findOne({ID:Location});
    if (!location) {
        return res.status(404).json({ error: 'Location not found' });
    }

    const LocationID = location._id;

    // Check if the resource exists
    const resource = await ResourceModel.findOne({ID:Resource});
    if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
    }

    const ResourceID = resource._id;

    //Check if the faculty exists

    const faculty = await User.findOne({Id:Faculty});

    if(!faculty && faculty.role != 'Faculty'){
        return res.status(404).json({ error: 'User not found' });
    }

    const FacultyID = faculty._id;

    // Create startingTime and endingTime
     const startingTime = DateTime.fromFormat(startTime, "h.mm a");
     const endingTime =  DateTime.fromFormat(endTime, "h.mm a");

      // Check if end time is after start time
      if(startingTime >= endingTime){
        res.status(400);
        throw new Error('End time should be after start time');

      }



     //Create new session
     const session = await SessionModel.create({

        sessiondate,
        DayOfWeek,
        startTime,
        endTime,
        SessionType,
        LocationID,
        ResourceID,
        FacultyID,
        

         
       });

       if(session){
        // Add the session ID to the sessions array in the timetable
         //Check if the timetable exists

        const timetable = await TimetableModel.findOne({ID : TimeTable});

        if (!timetable) {
        return res.status(404).json({ error: 'Timetable not found' });
        }

        timetable.sessions.push(session._id);
        await timetable.save();

        // Create new booking for resource
        const resourcebooking = await ResourceBookingModel.create({
        resourceId: resource._id,
        sessionId: session._id,
        
    });

     // Create new booking for location
     const locationbooking = await LocationBookingModel.create({
        locationId: location._id,
        sessionId: session._id,
         
    });

        // Respond with success
        return res.status(201).json({
            _id: session._id,
            time: session.startTime,
            message:"New Session created"
        });
       } else{
       res.status(400)
       throw new error('Invalid user data')
 }

} catch (error) {
    console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }

});

module.exports.removeSession = asyncHandler(async (req, res) => {
    try {

        
      const { sessionId } = req.body;

 
        
        console.log(sessionId);

        

        // Check if the session exists
        const session = await SessionModel.findById(sessionId);
        console.log(session);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Remove the session from the timetable
        const timetable = await TimetableModel.findOne({ sessions: sessionId });
        if (timetable) {
            timetable.sessions.pull(sessionId);
            await timetable.save();
        }

        // Cancel resource booking
        await ResourceBookingModel.deleteMany({ sessionId: sessionId });

        // Cancel location booking
        await LocationBookingModel.deleteMany({ sessionId: sessionId });

        // Delete the session
        const deletesession = await SessionModel.findByIdAndDelete(sessionId);

        if (deletesession) {
            try {

                const timetable = await TimetableModel.findOne({ sessions: sessionId });

                const courseName = await CourseModel.findOne({_id:timetable.courseId}).select('courseName');
        
                const enrollments = await CourseEnrollmentModel.find({ courseId: timetable.courseId });
        
                const students = enrollments.map(enrollment => enrollment.studentId);

                // Prepare email content
                const emailSubject = 'Session Cancel Notification';
                const emailBody = `Dear Student,\n\nThe timetable for ${courseName} has been updated. The session arranged to held on ${session.sessiondate} has been canceled\n\n`;

                await Promise.all(students.map(async (student) => {
                    const studentEmail = student.email;
                    await sendEmail(studentEmail, emailSubject, emailBody);
                }));
                
        
                // Respond with success
                return res.status(200).json({
                    message: "Session deleted successfully",
                    deletesession,
                    students // Include students in the response
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }


         
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports.UpdateSessionController = asyncHandler(async (req, res) => {
    try {
        
        const { sessionId } = req.query;
        const { sessiondate, DayOfWeek, startTime, endTime, SessionType , Location , Faculty} = req.body;

        const updateFields = {};

        if (sessiondate !== undefined) {
        // Check if sessionDate is a future date
        const sessionDate = DateTime.fromISO(sessiondate).toISODate();
        const currentDate = DateTime.now().toISODate();
        if (sessionDate < currentDate) {
            res.status(400);
            throw new Error('Invalid Date');
        }
          updateFields.sessiondate = sessiondate;
        }

        if(DayOfWeek !== undefined){
            // Validate Day
        const DaysinWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!DaysinWeek.includes(DayOfWeek)) {
            res.status(400);
            throw new Error('Invalid Date');
        }
        updateFields.DayOfWeek = DayOfWeek;
        }

        if(startTime !== undefined && endTime !== undefined){
            // Create startingTime and endingTime
        const startingTime = DateTime.fromFormat(startTime, "h.mm a");
        const endingTime = DateTime.fromFormat(endTime, "h.mm a");

        // Check if end time is after start time
        if (startingTime >= endingTime) {
            res.status(400);
            throw new Error('End time should be after start time');
        }
        updateFields.startTime = startTime;
        updateFields.endTime = startTime;
        }

        if(SessionType !== undefined){
        // Validate SessionType
        const validType = ['Lecture', 'Lab', 'Tutorial'];
        if (!validType.includes(SessionType)) {
            res.status(400);
            throw new Error('Invalid type. Session Type must be one of Lecture, Lab, Tutorial');
        }
        updateFields.SessionType = SessionType;
        }

        
        if(Location !== undefined){
        // Check if the location exists
        const location = await LocationModel.findOne({ ID: Location });
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }
        const LocationID = location._id;
        updateFields.LocationID = LocationID;
        }

        
 
        if(Faculty !== undefined){
        // Check if the faculty exists
        const faculty = await User.findOne({ Id: Faculty });
        if (!faculty || faculty.role !== 'Faculty') {
            return res.status(404).json({ error: 'Faculty not found' });
        }
        const FacultyID = faculty._id;
        updateFields.FacultyID = FacultyID;
    }

         

        // Update the session
        const session = await SessionModel.findByIdAndUpdate(sessionId, 
            { $set: updateFields } , 
            { new: true });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session) {
            try {

                 


                const timetable = await TimetableModel.findOne({ sessions: sessionId });

                const courseName = await CourseModel.findOne({_id:timetable.courseId}).select('courseName');
        
                const enrollments = await CourseEnrollmentModel.find({ courseId: timetable.courseId });
        
                const students = enrollments.map(enrollment => enrollment.studentId);

                // Prepare email content
                const emailSubject = 'Session Update Notification';
                const emailBody = `Dear Student,\n\nThe timetable for ${courseName} has been updated.\n\n`;

                await Promise.all(students.map(async (student) => {
                    const studentEmail = student.email;
                    await sendEmail(studentEmail, emailSubject, emailBody);
                }));
                
        
                // Respond with success
                return res.status(200).json({
                    message: "Session updated successfully",
                    session,
                    
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }


        
    

    
    
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports.AddResource__controller = asyncHandler(async (req, res) => {
try{
    const {ResourceType} = req.body;


    let newId;
    
    do {
            // Generate a random four-digit number
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            newId = "R" + randomNum.toString();
    } while (await ResourceModel.findOne({ ID: newId })); // Check if the generated ID already exists
        
    const ID = newId;   

    const resource = await ResourceModel.create({

        ResourceType,ID

    });

    if(resource){
        res.status(201).json({
            resource
             
            })
     } else{
        res.status(400)
        throw new error('Invalid resource data')
     }
        
    }

 catch (error) {
    console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }


});


module.exports.getResources__controller = asyncHandler(async (req, res, next) => {
    try {
      const resources = await ResourceModel.find()
      .select('ResourceType ID'); // Select all fields from the CourseModel
      return res.status(200).json({
        resources,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
  });


module.exports.AddLocation__controller = asyncHandler(async (req, res) => {
    try{
        const {LocationType, Capacity } = req.body;
    
    
        let newId;
        
        do {
                // Generate a random four-digit number
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                newId = "L" + randomNum.toString();
        } while (await LocationModel.findOne({ ID: newId })); // Check if the generated ID already exists
            
        const ID = newId;   
    
        const location = await LocationModel.create({
    
            LocationType,ID,Capacity
    
        });
    
        if(location){
            res.status(201).json({
                location
                 
                })
         } else{
            res.status(400)
            throw new error('Invalid resource data')
         }
            
        }
    
     catch (error) {
        console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
            
        }
    
    
    });
  

    module.exports.getLocations__controller = asyncHandler(async (req, res, next) => {
        try {
          const location = await LocationModel.find()
          .select('LocationType ID Capacity'); // Select all fields from the CourseModel
          return res.status(200).json({
            resources,
          });
        } catch (err) {
          console.log(err);
          return res.status(400).json({
            error: "Something went wrong",
          });
        }
      });

    