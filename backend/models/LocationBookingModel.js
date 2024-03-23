const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
    {

        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },


    },
    
    
    {
        timestamps: true,
      }
);

 
  const LocationBookingModel = mongoose.model("LocationBooking", bookingSchema);
  
  module.exports = LocationBookingModel;