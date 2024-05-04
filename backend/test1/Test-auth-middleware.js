const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

describe('Auth middleware', function() {
  it('should call next() if a valid token is provided', async function() {
    const req = {
      headers: {
        authorization: 'Bearer valid_token'
      }
    };
    const res = {};
    const next = sinon.spy();

    // Stubbing jwt.verify to return decoded token
    sinon.stub(jwt, 'verify').returns({ id: 'valid_user_id' });

    // Stubbing User.findById to return a user
    sinon.stub(User, 'findById').returns({ _id: 'valid_user_id' });

    await protect(req, res, next);

    expect(next.calledOnce).to.be.true;

    // Restoring stubs
    jwt.verify.restore();
    User.findById.restore();
  });

  it('should throw an error if no token is provided', async function() {
    const req = {
      headers: {}
    };
    const res = {};
    const next = sinon.spy();

    await protect(req, res, next);

    expect(next.called).to.be.false;
    expect(res).to.have.property('status').that.equals(401);
  });

  it('should throw an error if an invalid token is provided', async function() {
    const req = {
      headers: {
        authorization: 'Bearer invalid_token'
      }
    };
    const res = {};
    const next = sinon.spy();

    // Stubbing jwt.verify to throw an error
    sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    await protect(req, res, next);

    expect(next.called).to.be.false;
    expect(res).to.have.property('status').that.equals(401);

    // Restoring stub
    jwt.verify.restore();
  });

  it('should throw an error if user is not found for a valid token', async function() {
    const req = {
      headers: {
        authorization: 'Bearer valid_token'
      }
    };
    const res = {};
    const next = sinon.spy();

    // Stubbing jwt.verify to return decoded token
    sinon.stub(jwt, 'verify').returns({ id: 'valid_user_id' });

    // Stubbing User.findById to return null (user not found)
    sinon.stub(User, 'findById').returns(null);

    await protect(req, res, next);

    expect(next.called).to.be.false;
    expect(res).to.have.property('status').that.equals(401);

    // Restoring stubs
    jwt.verify.restore();
    User.findById.restore();
  });
});
