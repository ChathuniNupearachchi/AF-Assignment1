const mongoose = require("mongoose");

const locationSchema = mongoose.Schema(

    {
        LocationType:{
            type: String,
            required: true
        },

        ID:{
            type:String,
            required:true
        },
        Capacity:{
            type:Number,
            
        },

        

    },
    {
        timestamps: true,
      }
);

const LocationModel = mongoose.model("Location", locationSchema);

module.exports = LocationModel;
