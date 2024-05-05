const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const cors = require('cors'); // Import the cors package
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000
 



//Connect to database
connectDB()

const app = express()

app.use(cors(
    {
        origin: ['http://localhost:3000'], // Allow frontend to connect to backend
        methods: ['GET', 'POST'], // Allow the following methods
        credentials: true // Allow cookies to be sent from frontend to backend
    }
)); // Use cors as middleware

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({   
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:1000*60*60*24

    }
}));


app.get('/', (req, res) => {
    if(req.session.email){
        return res.json({valid : true , email : req.session.email})
    }else{
        return res.json({valid : false})
    }
})

//User Routes
app.use('/api/users', require('./routes/userRoutes'));

//Course Routes
app.use('/api/courses', require('./routes/courseRoute'));

//Enroll Routes
app.use('/api/enrollment',require('./routes/enrollRoute'));

//Timetable Routes
app.use('/api/timetables',require('./routes/timetableRoute'));

//Notices Route
app.use('/api/notices',require('./routes/NoticeRoute'));

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT} `))
