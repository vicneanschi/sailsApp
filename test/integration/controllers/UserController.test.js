/**
 * Created by val on 2016-04-06.
 */
var request = require('supertest');

describe('UserController', function() {

    describe('GET /user/me', function() {
        it(' should return 401 when token is invalid', function (done) {
            request(sails.hooks.http.app)
                .get('/user/me')
                .send({ token: 'foo' })
                .expect(401, done);

        });
    });

});
