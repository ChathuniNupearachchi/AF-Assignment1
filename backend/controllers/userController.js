const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require("validator");
const User = require('../models/userModel');
const { error } = require('console');



// @desc  Register a new user
// @route /api/users
// @accesss Public
const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password, role} =req.body;


    //Validation
    if(!name || !email || !password || !role){
     res.status(400)
     throw new Error('Please include all fields')
    }

     //check whether the email is a valid one
     if (!validator.isEmail(email)) {
    res.status(400)
     throw new Error('Email is not valid')
     }

     // Validate role
    const validRoles = ['Student', 'Faculty', 'Admin'];
    if (!validRoles.includes(role)) {
        res.status(400);
        throw new Error('Invalid role. Role must be one of Student, Faculty, or Admin');
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
        role,
    });

    if(user){
        res.status(201).json({
        _id:user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
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
      res.status(200).json({
        _id:user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),  
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

module.exports = {
    registerUser,
    loginUser,
    getMe,
}