const expect = require('chai').expect;
const sinon = require('sinon');
const authentication = require('../middleware/authentication');

describe('Admin Authentication Middleware', function() {
  it('should call next() if user is an admin', function() {
    const req = {
      user: {
        role: 'Admin'
      }
    };
    const res = {};
    const next = sinon.spy();

    authentication.adminAuthentication(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should return 401 error if user is not an admin', function() {
    const req = {
      user: {
        role: 'Student'
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    const next = sinon.spy();

    authentication.adminAuthentication(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ err: 'Access Denied' })).to.be.true;
    expect(next.called).to.be.false;
  });
});

describe('Student Authentication Middleware', function() {
  it('should call next() if user is a student', function() {
    const req = {
      user: {
        role: 'Student'
      }
    };
    const res = {};
    const next = sinon.spy();

    authentication.studentAuthentication(req, res, next);

    expect(next.calledOnce).to.be.true;
  });

  it('should return 401 error if user is not a student', function() {
    const req = {
      user: {
        role: 'Admin'
      }
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    const next = sinon.spy();

    authentication.studentAuthentication(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ err: 'Access Denied' })).to.be.true;
    expect(next.called).to.be.false;
  });
});
