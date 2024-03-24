const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
    {

        Notification: {
            type: String,
             
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


    },
    
    
    {
        timestamps: true,
      }
);

 
  const NotificationModel = mongoose.model("Notice", notificationSchema);
  
  module.exports = NotificationModel;