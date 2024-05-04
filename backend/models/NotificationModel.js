const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
    {

        notice: {
            type: String,
             
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },


    },
    
    
    {
        timestamps: true,
      }
);

 
  const NotificationModel = mongoose.model("Notice", notificationSchema);
  
  module.exports = NotificationModel;