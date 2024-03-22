const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseCode:{
      type:String,
      required:true,
    },
    courseName: {
      type: String,
      required: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    credits:{
      type:Number,
      required:true,

    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
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

const CourseModel = mongoose.model("Course", courseSchema);

module.exports = CourseModel;
