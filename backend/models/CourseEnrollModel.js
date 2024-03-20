const mongoose = require("mongoose");

const enrollmentSchema = mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const CourseEnrollmentModel = mongoose.model("CourseEnrollment", enrollmentSchema);

module.exports = CourseEnrollmentModel;
