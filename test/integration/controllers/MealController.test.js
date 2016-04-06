/**
 * Created by val on 2016-04-06.
 */
var request = require('supertest');
var expect = require('chai').expect;

describe('AuthController', function () {
    var token;

    describe('POST /meal when not authenticated', function () {
        it('should return 401', function (done) {
            request(sails.hooks.http.app)
                .post('/meal')
                .send({
                    title: 'lunch1',
                    calories: 1234,
                    eatenAt: '2016-01-01 12:23'
                })
                .expect(401, done);
        });


    });

    describe('POST /meal when authenticated', function () {
        beforeEach(function (done) {
            request(sails.hooks.http.app)
                .post('/auth/signin')
                .send({email: 'user1@test.com', password: 'user1pwd'})
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    token = res.body.token;
                    expect(token).to.be.ok;
                }).end(done);
        });

        it('should return 201', function (done) {
            request(sails.hooks.http.app)
                .post('/meal')
                .set('Authorization', 'JWT ' + token)
                .send({
                    title: 'lunch1',
                    calories: 1234,
                    eatenAt: '2016-01-01 12:23'
                })
                .expect(201)
                .end(function (err, res) {
                    if (err) return done(err);

                    Meal.find({title: 'lunch1'}).exec(function (err, meals) {
                        if (err) return done(err);

                        expect(meals).to.have.length.at.least(1);
                        return done();
                    });
                });
        })


    });


});
