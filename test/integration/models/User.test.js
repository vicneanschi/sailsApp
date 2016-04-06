/**
 * Created by val on 2016-04-06.
 */
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

});
