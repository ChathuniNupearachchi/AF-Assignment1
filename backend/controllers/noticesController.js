const UserModel = require("../models/userModel");
const NoticeModel = require("../models/NotificationModel");

const asyncHandler = require('express-async-handler');


module.exports.createNotice__controller = asyncHandler(async (req, res) => {

  try{

    const {notice} = req.body;

    const {createdBy} = req.user._id;

    if (!notice) {

        return res.status(400).json({
          error: "Please Provide a notice",
        });
      }

       //Create user
       const Notice = await NoticeModel.create({
         notice,
         createdBy
    });

    if(Notice){
        res.status(201).json({
          message : "Notice published successfully",
          Notice
          })
    }else{
        res.status(400)
        throw new error('Something went wrong')
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
  


});


module.exports.getNotices__controller = asyncHandler(async (req, res) => {
    try {
      const notices = await NoticeModel.find()
      .populate(
         'createdBy','name Id'
         // Populate only specific fields from the User model
      )
      .select('notice'); // Select all fields from the NoticeModel
      return res.status(200).json({
        notices,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong",
      });
    }
  });
  