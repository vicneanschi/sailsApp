/**
 * Created by val on 2016-04-06.
 */
var request = require('supertest');
var expect = require('chai').expect;

describe('AuthController', function () {

    describe('POST /auth/signup', function () {
        it('should return 201 with the token', function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signup')
                .send({username: 'foo', email: 'foo@bar.com', password: 'pwd'})
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    if (err) return done(err);

                    User.find({email: 'foo@bar.com'}).exec(function (err, user) {
                        if (err) return done(err);

                        expect(user).to.not.be.null;
                        return done();
                    });
                });
        });

        it('should fail when username is not provided');
        it('should fail when password is not provided');
        it('should fail when email is not well formatted');


    });

    describe('POST /auth/signin', function () {
        it('should return 200 with the token', function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signin')
                .send({email: 'user1@test.com', password: 'user1pwd'})
                .expect('Content-Type', /json/)
                .expect(function(res){
                    expect(res.body.token).to.be.ok;
                })
                .expect(200, done);
        });

        it('should return 401 when username is not provided', function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signin')
                .send({password: 'user1pwd'})
                .expect(401, done);
        });

        it('should return 401 when password is not provided', function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signin')
                .send({email: 'user1@test.com'})
                .expect(401, done);
        });

        it('should return 401 when credentials are invalid', function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signin')
                .send({email: 'non@existing.com', password: 'foo'})
                .expect(401, done);
        });

    });


});
