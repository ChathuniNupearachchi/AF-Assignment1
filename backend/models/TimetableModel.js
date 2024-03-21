const mongoose = require("mongoose");


const timetableSchema = mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
          },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true, 
          },

        sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session" // Reference the SessionModel
    }]
   
},
{
    timestamps: true,
  }

);

const TimetableModel = mongoose.model("TimeTable", timetableSchema);

module.exports = TimetableModel;