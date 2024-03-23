const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
    {

        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resource",
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

 
  const ResourceBookingModel = mongoose.model("ResourceBooking", bookingSchema);
  
  module.exports = ResourceBookingModel;