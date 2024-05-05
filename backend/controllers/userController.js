const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require("validator");
const User = require('../models/userModel');
const { error } = require('console');



// @desc  Register a new user
// @route /api/users
// @accesss Public
// const registerUser = asyncHandler(async (req, res) => {
    
//     const {name, email, password, role} =req.body;


//     //Validation
//     if(!name || !email || !password || !role){
//      res.status(400)
//      throw new Error('Please include all fields')
//     }

//      //check whether the email is a valid one
//      if (!validator.isEmail(email)) {
//     res.status(400)
//      throw new Error('Email is not valid')
//      }

//      // Validate role
//     const validRoles = ['Student', 'Faculty', 'Admin'];
//     if (!validRoles.includes(role)) {
//         res.status(400);
//         throw new Error('Invalid role. Role must be one of Student, Faculty, or Admin');
//     }

//     let Id;

//     if (role == 'Student') {
//         let newId;
//         do {
//             // Generate a random four-digit number
//             const randomNum = Math.floor(1000 + Math.random() * 9000);
//             newId = "ST" + randomNum.toString();
//         } while (await User.findOne({ id: newId })); // Check if the generated ID already exists
        
//         Id = newId;
//     }

//     if (role == 'Faculty') {
//         let newId;
//         do {
//             // Generate a random four-digit number
//             const randomNum = Math.floor(1000 + Math.random() * 9000);
//             newId = "FAC" + randomNum.toString();
//         } while (await User.findOne({ id: newId })); // Check if the generated ID already exists
        
//         Id = newId;
//     }

//     if (role == 'Admin') {
//         let newId;
//         do {
//             // Generate a random four-digit number
//             const randomNum = Math.floor(1000 + Math.random() * 9000);
//             newId = "AD" + randomNum.toString();
//         } while (await User.findOne({ Id: newId })); // Check if the generated ID already exists
        
//         Id = newId;
//     }




//     //Find if user already exists
//     const userExists = await User.findOne({email})
    
//     if(userExists){
//         res.status(400)
//         throw new Error('User already exists')
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)
    


//     //Create user
//     const user = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         role,
//         Id,
//     });

//     if(user){
//         res.status(201).json({
//         id:user.Id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user._id, user.role),
//         })
//  } else{
//     res.status(400)
//     throw new error('Invalid user data')
//  }
 
// })

const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password} =req.body;


    //Validation
    if(!name || !email || !password){
     res.status(400)
     throw new Error('Please include all fields')
    }

     //check whether the email is a valid one
     if (!validator.isEmail(email)) {
    res.status(400)
     throw new Error('Email is not valid')
     }

    




    //Find if user already exists
    const userExists = await User.findOne({email})
    
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    


    //Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        
    });

    if(user){
        res.status(201).json({
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        })
 } else{
    res.status(400)
    throw new error('Invalid user data')
 }
 
})



// @desc  Login a user
// @route /api/users/login
// @accesss Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    //Check user and password match
    if(user && (await bcrypt.compare(password, user.password))){

        req.session.email = user.email;
        console.log(req.session.email);

      res.status(200).json({
        _id:user.Id,
        name: user.name,
        email: user.email,
        
        token: generateToken(user._id),  
    })
    
    
     
} else{
    res.status(401)
    throw new Error('Invalid credentials')
}
 
})

// @desc  Get current user
// @route /api/users/me
// @accesss Private
const getMe = asyncHandler(async (req, res) => {
    const user ={
        id: req.user._id,
        email: req.user.email,
        name: req.user.name
    }
    
    res.status(200).json(user)
})

//Generate token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

const logoutUser = (req, res) => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  };

module.exports = {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
}