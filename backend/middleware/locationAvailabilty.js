const asyncHandler = require('express-async-handler');
const SessionModel = require('../models/SessionModel');
const LocationModel = require('../models/LocationModel');
const { DateTime } = require('luxon');

module.exports.locationAvailability = asyncHandler(async(req, res, next) => {

    const { sessiondate ,startTime, endTime, Location } = req.body;

    console.log("checking location availability");

    if (!sessiondate || !Location || !startTime || !endTime) {

        return res.status(400).json({ error: "Missing required fields" });
    }

    //console.log(sessiondate);

    try {
        // Find sessions for the given resource ID
        const location = await LocationModel.findOne({ID : Location});
        const sessions = await SessionModel.find({ LocationID : location._id , sessiondate });

        // Check for overlapping sessions
        const overlappingSession = sessions.filter(session => {

            return (startTime <= session.endTime  &&  endTime >=  session.startTime);
        });

        if (overlappingSession.length>0) {
            // Resource is not available for the new session
            return res.status(409).json({ error: "Location is not available for the given time slot" });
        }

        // If no overlapping session found, resource is available
         

        next();
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error checking location availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
      


})
