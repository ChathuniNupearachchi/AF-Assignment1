const mongoose = require('mongoose')

// const userSchema = mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, 'Please add a name'],
//         },
//         email: {
//             type: String,
//             required: [true, 'Please add an email'],
//             unique: true,
//         },
//         password:{
//             type: String,
//             required: [true, 'Please add a password'],
//         },
//          role: {
//             type: String,
//             enum: ['Admin', 'Faculty', 'Student'],
//             required: true,
//             default: 'Student', // Default role is Student
//         },
//         Id:{
//             type: String,
//             required: true,

//         },
//     },
//     {
//         timestamps: true,
//     }
// )

// module.exports = mongoose.model('User', userSchema)

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password:{
            type: String,
            required: [true, 'Please add a password'],
        } 
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)