const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema(

    {
        Date:{
            type: Date,
            required: true
        },

        DayOfWeek:{
            type:String,
            required:true
        },

        startTime: { 
            type: Date, 
            required: true 
        },
        endTime: { 
            type: Date, 
            required: true 
        },

        SessionType:{
            type: String,
            enum : ['Lecture','Lab','Tutorial'],
            required:true,
            default:'Lecture'
        },

        Location:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Resource',
            required:true
        },

        Resource:{
            ype:mongoose.Schema.Types.ObjectId,
            ref:'Resource',
            
        }



    },

    {
        timestamps: true,
      }
);

const SessionModel = mongoose.model("Session", sessionSchema);

module.exports = SessionModel;













