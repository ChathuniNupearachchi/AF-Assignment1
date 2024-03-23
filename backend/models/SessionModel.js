const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(

    {
        sessiondate:{
            type: String,
            required: true
        },

        DayOfWeek:{
            type:String,
            required:true
        },

        startTime: { 
            type: String, 
            required: true 
        },
        endTime: { 
            type: String, 
            required: true 
        },

        SessionType:{
            type: String,
            enum : ['Lecture','Lab','Tutorial'],
            required:true,
            default:'Lecture'
        },

        LocationID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Location',
            required:true
        },

        ResourceID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Resource',
            
        },

        FacultyID :{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true

        },

         



    },

    {
        timestamps: true,
      }
);

const SessionModel = mongoose.model("Session", sessionSchema);

module.exports = SessionModel;













