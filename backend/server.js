const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 4000


//Connect to database
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.status(200).json({message: 'Welcome to the SLIIT'})
})

//User Routes
app.use('/api/users', require('./routes/userRoutes'));

//Course Routes
app.use('/api/courses', require('./routes/courseRoute'));

//Enroll Routes
app.use('/api/enrollment',require('./routes/enrollRoute'));

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT} `))
