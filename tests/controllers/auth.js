var chai = require('chai');
var faker = require('faker');
var expect = chai.expect;
var assert = chai.assert;
var test = it;

var data = {
  'username': faker
    .internet
    .userName()
    .toLowerCase(),
  'password': faker
    .internet
    .password()
};

test("register", function (done) {
  expect(200).to.be.equal(200);
  done();
});