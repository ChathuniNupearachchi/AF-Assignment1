// const { expect } = require('chai');
// const sinon = require('sinon');
// const jwt = require('jsonwebtoken');
// const { protect } = require('../middleware/authMiddleware');

// describe('Auth middleware', function() {
//   it('should throw an error if no authorization header is present', function() {
//     const req = {
//       get: function(headerName) {
//         return null; // Simulate missing authorization header
//       }
//     };

//     // Use an arrow function with expect to handle the invocation of protect
//     expect(() => protect(req, {}, () => {})).to.throw('Not authorized.');
//   });
// });

// const expect  = require('chai').expect;
// const sinon = require('sinon');
// const jwt = require('jsonwebtoken');
// const { protect } = require('../middleware/authMiddleware');

// describe('Auth middleware', function() {
//   it('should throw an error if no authorization header is present', function() {
//     const req = {
//       get: function(headerName) {
//         return null; // Simulate missing authorization header
//       }
//     };

//     // Use an arrow function with expect to handle the invocation of protect
//     expect(protect.bind(this,req,{},() => {})).to.throw('Not authorized.');
//   });
// });

// import expect from 'chai';
// import sinon from 'sinon';
// import jwt from 'jsonwebtoken';
// const {protect} = require('../middleware/authMiddleware') // Might need adjustment based on export structure

// describe('Auth middleware', function() {
//     it('should throw an error if no authorization header is present', function() {
//         const req = {
//             get: function(headerName) {
//                 return null; // Simulate missing authorization header
//             }
//         };

//         // Use an arrow function with expect to handle the invocation of protect
//         expect(protect.bind(this, req, {}, () => {})).to.throw('Not authorized.');
//     });
// });
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // Adjust the path based on your project structure

describe('Auth middleware', function() {
    it('should throw an error if no authorization header is present', function() {
        const req = {
            get: function(headerName) {
                return null; // Simulate missing authorization header
            }
        };

        // Use a traditional function with chai.expect to handle the invocation of protect
        expect(() => protect(req, {}, () => {})).to.throw('Not authorized.');
    });
});


