const mongoose = require("mongoose");


const timetableSchema = mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
          },
        facultyId: {
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