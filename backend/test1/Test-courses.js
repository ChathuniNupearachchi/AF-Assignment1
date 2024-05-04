const expect = require('chai').expect;
const sinon = require('sinon');
const { 
  postCourse__controller, 
  
} = require('../controllers/courseController');

const Course = require("../models/CourseModel");
jest.mock('../model/CourseModel');

 
  describe('postCourse__controller', function() {
    it('should create a new course successfully', async function() {
      const req = {
        body: {

            courseCode:'SE2010',
            courseName:'Software Engineerng',
            courseDescription:'Course duration is 4 years',
            credits:4,
            faculty:'FAC3684',
             
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

       // Mock Course.create to resolve with the created course
       const createdCourse = { _id: 'courseId', ...req.body };
       Course.create.mockResolvedValueOnce(createdCourse);

      await postCourse__controller(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(createdCourse);
    });

    
  });

   