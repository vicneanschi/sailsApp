/**
 * Created by val on 2016-04-06.
 */
var request = require('supertest');
var expect = require('chai').expect;

describe('MealController', function () {
  var token;


  describe('when authenticated', function () {
    var id;
    var userId;

    before(function (done) {
      request(sails.hooks.http.app)
        .post('/auth/signin')
        .send({email: 'user1@test.com', password: 'user1pwd'})
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function (res) {
          token = res.body.token;
          expect(token).to.be.ok;
          userId = res.body.user.id;
        }).end(done);
    });

    it('POST /meal should create and return 201', function (done) {
      request(sails.hooks.http.app)
        .post('/meal')
        .set('Authorization', 'JWT ' + token)
        .send({
          title: 'lunch1',
          calories: 1234,
          eatenAtDate: '2016-01-01',
          eatenAtTime: 1320
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(function(res){
          var meal = res.body;
          //console.log(meal);
          id = res.body.id;

          expect(meal.title).be.equal('lunch1');
          expect(meal.calories).be.equal(1234);
          expect(meal.eatenAtTime).be.equal(1320);
          expect(meal.eatenAtDate).contains('2016-01-01');
          expect(meal.owner).be.equal(userId);
        })
        .end(function (err, res) {
          if (err) return done(err);

          Meal.findOne(id).exec(function (err, meal) {
            if (err) return done(err);

            expect(meal.title).to.be.eql('lunch1');
            return done();
          });
        });
    });

    it('Can GET /meal/:id', function (done) {
      request(sails.hooks.http.app)
        .get('/meal/' + id)
        .set('Authorization', 'JWT ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res){
          var meal = res.body;
          //console.log(meal);
          id = res.body.id;

          expect(meal.title).be.equal('lunch1');
          expect(meal.calories).be.equal(1234);
          expect(meal.eatenAtTime).be.equal(1320);
          expect(meal.eatenAtDate).contains('2016-01-01');
        })
        .end(done);
    });

    it('PUT /meal/:id should update', function (done) {
      request(sails.hooks.http.app)
        .put('/meal/' + id)
        .set('Authorization', 'JWT ' + token)
        .send({
          title: 'lunch1-updated',
          calories: 9876,
          eatenAtDate: '2012-05-12 23:45',
          eatenAtTime: 1809
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res){
          var meal = res.body;

          expect(meal.title).be.equal('lunch1-updated');
          expect(meal.calories).be.equal(9876);
          expect(meal.eatenAtTime).be.equal(1809);
          expect(new Date(meal.eatenAtDate).getTime()).be.equal(new Date('2012-05-12 23:45').getTime());
        })
        .end(function (err, res) {
          if (err) return done(err);

          //check the database
          Meal.findOne(id).exec(function (err, meal) {
            if (err) return done(err);
            //console.log(meal);

            expect(meal).to.not.be.null;
            expect(meal.title).be.equal('lunch1-updated');
            expect(meal.calories).be.equal(9876);
            expect(meal.eatenAtTime).be.equal(1809);
            expect(meal.eatenAtDate.getTime()).to.eql(new Date('2012-05-12 23:45').getTime());
            return done();
          });
        });
    });

    it('partial PUT /meal/:id should not touch other fields', function (done) {
      request(sails.hooks.http.app)
        .put('/meal/' + id)
        .set('Authorization', 'JWT ' + token)
        .send({
          title: 'lunch1-updated-partial'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res){
          var meal = res.body;

          expect(meal.title).be.equal('lunch1-updated-partial');
          expect(meal.calories).be.equal(9876);
          expect(meal.eatenAtTime).be.equal(1809);
          expect(new Date(meal.eatenAtDate).getTime()).to.equal(new Date('2012-05-12 23:45').getTime());
        })
        .end(function (err, res) {
          if (err) return done(err);

          //check the database
          Meal.findOne(id).exec(function (err, meal) {
            if (err) return done(err);
            //console.log(meal);

            expect(meal).to.not.be.null;
            expect(meal.title).be.equal('lunch1-updated-partial');
            expect(meal.calories).be.equal(9876);
            expect(meal.eatenAtTime).be.equal(1809);
            expect(meal.eatenAtDate.getTime()).be.equal(new Date('2012-05-12 23:45').getTime());
            return done();
          });
        });
    });

    it('Can DELETE /meal/:id', function (done) {
      request(sails.hooks.http.app)
        .delete('/meal/' + id)
        .set('Authorization', 'JWT ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done);
    });

    it('GET /meal/:id for deleted object should return 404', function (done) {
      request(sails.hooks.http.app)
        .get('/meal/' + id)
        .set('Authorization', 'JWT ' + token)
        .expect('Content-Type', /html/)
        .expect(404)
        .end(done);
    });

    
    it('should not change owner');


    describe('Permissions', function () {
      describe('POST /meal when not authenticated', function () {
        it('should return 401', function (done) {
          request(sails.hooks.http.app)
            .post('/meal')
            .send({
              title: 'lunch1',
              calories: 1234,
              eatenAtDate: '2016-01-01',
              eatenAtTime: 1250
            })
            .expect('Content-Type', /json/)
            .expect(401, done);
        });
      });

      describe('Admin', function () {
        it('Admin role can manage meals');
      });

      describe('Manager', function () {
        it('Manager role can not manage meals');
      });

      describe('User', function () {
        it('User role can manage only own meals');
      });
    });

  });


});
