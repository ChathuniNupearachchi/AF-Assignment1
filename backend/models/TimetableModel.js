const mongoose = require("mongoose");


const timetableSchema = mongoose.Schema(
    {
        ID: {
          type: String,
          required: true,


        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
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