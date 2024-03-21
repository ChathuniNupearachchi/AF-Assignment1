const mongoose = require("mongoose");

const resourceSchema = mongoose.Schema(

    {
        ResourceType:{
            type: String,
            required: true
        },

        Location:{
            type:String,
            
        },

        

    },
    {
        timestamps: true,
      }
);

const ResourceModel = mongoose.model("Resource", resourceSchema);

module.exports = ResourceModel;
