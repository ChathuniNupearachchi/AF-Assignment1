const asyncHandler = require('express-async-handler');
const SessionModel = require('../models/SessionModel');
const ResourceModel = require('../models/ResourceModel');
//const { DateTime } = require('luxon');

module.exports.resourceAvailability = asyncHandler(async(req, res, next) => {

    const { sessiondate , startTime, endTime, Resource } = req.body;

    if (!sessiondate || !Resource || !startTime || !endTime) {

        return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("checking resource availability");


    try {
        // Find sessions for the given resource ID
        const resource = await ResourceModel.findOne({ID : Resource});
        //console.log(resource._id);

        const sessions = await SessionModel.find({  ResourceID : resource._id , sessiondate });

         
        // Check for overlapping sessions
        const overlappingSession = sessions.find(session => {
            return (
                session.sessiondate === sessiondate &&
                ((startTime >= session.startTime && startTime < session.endTime) ||
                (endTime > session.startTime && endTime <= session.endTime) ||
                (startTime <= session.startTime && endTime >= session.endTime))
            );
        });

        if (overlappingSession) {
            // Found overlapping session
            return res.status(409).json({ error: "Resource is not available for the given time slot" });
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

 