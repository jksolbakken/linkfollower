let follower = require('../linkfollower');
let chai = require('chai');
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let webserver = require('./webserver');

chai.use(chaiAsPromised);


describe("linkfollower", function () {

  let expected = [
    {
      "status": 302,
      "url": "http://localhost:3000/3"
    },
    {
      "status": 302,
      "url": "http://localhost:3000/2"
    },
    {
      "status": 200,
      "url": "http://localhost:3000/1"
    }
  ];

  it("should return an array with urls and status codes", function () {
    let result = follower.follow('http://localhost:3000/3');
    return expect(result).to.eventually.deep.equal(expected);
  });

  it("should cope with up to 10 redirects", function () {
    let result = follower.follow('http://localhost:3000/10');
    return expect(result).to.eventually.be.fulfilled;
  });
  
  it("should fail if more than 10 redirects", function () {
    let result = follower.follow('http://localhost:3000/11');
    return expect(result).to.eventually.be.rejectedWith('Exceeded max redirect depth of 10');
  });

});