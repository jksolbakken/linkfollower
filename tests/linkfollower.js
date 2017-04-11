let follower = require('../linkfollower');
let chai = require('chai');
let expect = chai.expect;
let chaiAsPromised = require('chai-as-promised');
let webserver = require('./webserver');

chai.use(chaiAsPromised);

describe("linkfollower", function () {

  it("should return an array with urls and status codes", function () {
    let result = follower.follow('http://localhost:3000/3');
    return expect(result).to.eventually.deep.equal(expectedStatusCodesOnly);
  });

  it("should cope with up to 10 redirects", function () {
    let result = follower.follow('http://localhost:3000/10');
    return expect(result).to.eventually.be.fulfilled;
  });

  it("should fail if more than 10 redirects", function () {
    let result = follower.follow('http://localhost:3000/11');
    return expect(result).to.eventually.be.rejectedWith('Exceeded max redirect depth of 10');
  });

  it("should fail if status code redirect without location header", function () {
    let result = follower.follow('http://localhost:3000/nolocation');
    return expect(result).to.eventually.be.rejectedWith('http://localhost:3000/nolocation returned a redirect but no URL');
  });

  it("should add missing http prefix in links", function () {
    let result = follower.follow('localhost:3000/1');
    return expect(result).to.eventually.be.fulfilled;
  });

  it("should handle 200 + meta refresh tag", function () {
    let result = follower.follow('localhost:3000/meta');
    return expect(result).to.eventually.deep.equal(expectedWithMetaRefresh);
  });

  it("should reject invalid URLs", function () {
    let result = follower.follow('bogus://something');
    return expect(result).to.eventually.be.rejected;
  });

  let expectedStatusCodesOnly = [
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

  let expectedWithMetaRefresh = [
    {
      "status": "200 + META REFRESH",
      "url": "http://localhost:3000/meta"
    },
    {
      "status": 200,
      "url": "http://localhost:3000/1"
    }
  ];

});
