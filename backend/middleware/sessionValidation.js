const asyncHandler = require('express-async-handler');
const SessionModel = require('../models/SessionModel');
const ResourceModel = require('../models/ResourceModel');
const TimeTableModel = require('../models/TimetableModel');
//const { DateTime } = require('luxon');

module.exports.sessionValidation = asyncHandler(async(req, res, next) => {

    const { sessiondate , startTime, endTime, TimeTable } = req.body;

    console.log("start session validation");

    if (!sessiondate || !TimeTable || !startTime || !endTime) {

        return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("checking sessions");


    try {
        // Find sessions for the given resource ID
        const timetable = await TimeTableModel.findOne({ID : TimeTable});
        //console.log(resource._id);

        console.log(timetable);

        const sessions = timetable.sessions;

        console.log(sessions);

        // Fetch all sessions from the database
        const allSessions = await SessionModel.find({ _id: { $in: sessions } });

        //console.log(allSessions);

       
        // Check for overlapping sessions
        const overlappingSession = allSessions.find(session => {
            return (
                session.sessiondate === sessiondate &&
                ((startTime >= session.startTime && startTime < session.endTime) ||
                (endTime > session.startTime && endTime <= session.endTime) ||
                (startTime <= session.startTime && endTime >= session.endTime))
            );
        });

        if (overlappingSession) {
            // Found overlapping session
            return res.status(409).json({ error: "Session time slot clashes with existing session" });
        }
    

        console.log(overlappingSession);
        
        // if (overlappingSession.length > 0) {
        //     // Resource is not available for the new session
        //     return res.status(409).json({ error: "Session is invalid" });
        // }

        // If no overlapping session found, resource is available
         

        next();
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error checking resource availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
      


})

 