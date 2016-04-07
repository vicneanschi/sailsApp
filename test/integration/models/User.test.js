/**
 * Created by val on 2016-04-06.
 */

var expect = require('chai').expect;

describe('UserModel', function () {

  describe('#findOne()', function () {
    it('should find user populated from fixtures and populate meals', function (done) {
      User.findOne({email: "user1@test.com"})
        .populate('meals')
        .then(function (user) {
          done();
        })
        .catch(done);
    });
  });
  
  describe('#create()', function () {
    it('should encrypt password', function (done) {
      User.create({email: "userX@test.com", password: 'pwd'})
        .then(function (user) {
          expect(user.password).to.not.equal('pwd');
          done();
        })
        .catch(done);
    });
  });

});
