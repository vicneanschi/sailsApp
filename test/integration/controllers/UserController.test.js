/**
 * Created by val on 2016-04-06.
 */
var request = require('supertest');
var expect = require('chai').expect;

describe('UserController', function () {
    var token;

    before(function (done) {
        request(sails.hooks.http.app)
            .post('/auth/signin')
            .send({email: 'user1@test.com', password: 'user1pwd'})
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function (res) {
                token = res.body.token;
                expect(token).to.be.ok;
            }).end(done);
    });

    it('GET /user/:id should return 200 with expected attributes', function (done) {
        request(sails.hooks.http.app)
            .get('/user/13')
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var user = res.body;
                console.log(user);
                expect(user).to.have.property('firstName', 'John');
                expect(user).to.have.property('lastName', 'Doe');
                expect(user).to.have.property('dailyCaloriesLimit', 1000);
                expect(user).to.not.have.property('password');
                expect(user).to.not.have.property('meals');
            })
            .end(done);
    });



    it('POST /user should create');
    it('PUT /user should update');
    it('DELETE /user should delete');

   

    it('GET /user/:id/meals should return populated meal', function (done) {
        request(sails.hooks.http.app)
            .get('/user/13/meals')
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var meals = res.body;
                expect(meals.length).to.equal(4);
            })
            .end(done);
    });

    it('GET /user/:id/meals?where shoud filter by title using query string parameter', function (done) {
        request(sails.hooks.http.app)
            .get('/user/13/meals?title=breakfast')
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var meals = res.body;
                expect(meals.length).to.equal(1);
                expect(meals[0].title).to.equal('breakfast');
            })
            .end(done);
    });

    it('GET /user/:id/meals?where should filter by date and time', function (done) {
        var where = {eatenAtDate:{">=": new Date('2016-01-02'), "<=": new Date('2016-01-03')} ,"eatenAtTime":{">=":1200, "<=": 1300}};

        request(sails.hooks.http.app)
            .get('/user/13/meals?where=' + encodeURIComponent(JSON.stringify(where)))
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var meals = res.body;
                expect(meals.length).to.equal(2);
                expect(meals[0].title).to.have.string('lunch');
            })
            .end(done);
    });

    it('GET /user/:id/meals?where should return zero if nothing gets into date period', function (done) {
        var where = {eatenAtDate:{">=": new Date('2016-01-06'), "<=": new Date('2016-02-01')} ,"eatenAtTime":{">=":1200, "<=": 1300}};

        request(sails.hooks.http.app)
            .get('/user/13/meals?where=' + encodeURIComponent(JSON.stringify(where)))
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var meals = res.body;
                expect(meals).to.be.empty;
            })
            .end(done);
    });

    it('GET /user/:id/meals?where should return zero if nothing gets into time frame', function (done) {
        var where = {eatenAtDate:{">=": new Date('2016-01-02'), "<=": new Date('2016-01-02')} ,"eatenAtTime":{">=":2100, "<=": 2300}};

        request(sails.hooks.http.app)
            .get('/user/13/meals?where=' + encodeURIComponent(JSON.stringify(where)))
            .set('Authorization', 'JWT ' + token)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(function(res){
                var meals = res.body;
                expect(meals).to.be.empty;
            })
            .end(done);
    });


    describe('Permissions', function () {
        describe('Admin', function () {
            it('Admin role can manage users');
        });

        describe('Manager', function () {
            it('Manager role can manage users');
        });

        describe('User', function () {
            it('User role can not manage users');
        });
    });


});
