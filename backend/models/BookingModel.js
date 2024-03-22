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

 
  const BookingModel = mongoose.model("Booking", bookingSchema);
  
  module.exports = BookingModel;