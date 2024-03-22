const asyncHandler = require('express-async-handler')
const SessionModel = require('../models/SessionModel')

module.exports.resourceAvailability = asyncHandler(async(req, res, next) => {

    const { Resource, startTime, endTime } = req.body;

    if (!Resource || !startTime || !endTime) {
        return res.status(400).json({ error: "Missing required fields" });
    }


    try {
        // Find sessions for the given resource ID
        const sessions = await SessionModel.find({ Resource });

        // Check for overlapping sessions
        const overlappingSession = sessions.find(session => {
            return (startTime < session.endTime && endTime > session.startTime);
        });

        if (overlappingSession) {
            // Resource is not available for the new session
            return res.status(409).json({ error: "Resource is not available for the given time slot" });
        }

        // If no overlapping session found, resource is available
        res.status(200).json({ available: true });

        next();
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error checking resource availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
      


})