/**
 * Created by val on 2016-04-06.
 */
var expect = require('chai').expect;

describe('MealModel', function () {
  var userId;

  before(function (done) {
    User.findOne({email: "user1@test.com"})
      .then(function (user) {
        userId = user.id;
        done();
      })
      .catch(done);
  });

  describe('#create()', function () {
    it('should create meal', function (done) {
      Meal.create({
          title: "branch",
          calories: 1,
          eatenAtDate: '1980-01-01 21:03',
          eatenAtTime: 1,
          owner: userId
        })
        .then(function (meal) {
          expect(meal.eatenAtDate).be.eql(new Date('1980-01-01 21:03'));
          done();
        })
        .catch(done);
    });
  });

  describe('#groupBy() with sum', function () {
    it('should sum calories by date for a user', function (done) {
      Meal.find({
          owner: userId,
          eatenAtDate: {
            ">=": new Date('2016-01-02'),
            "<=": new Date('2016-01-03')
          },
          eatenAtTime: {
            ">=": 200,
            "<=": 2300
          }
        })
        .groupBy('eatenAtDate')
        .sum('calories')
        .sort("_id DESC")
        .skip(1)
        .limit(2)
        .then(function (results) {
          console.log(results);
          // expect(results).to.have.length(1);
          expect(results[0].eatenAtDate).be.eql(new Date('2016-01-02'));
          expect(results[0].calories).to.equal(3000);
          done();
        })
        .catch(done);
    });
  });

  describe('native mongodb query', function () {
    it('can run native aggregation query', function (done) {
      Meal.native(function (err, collection) {
        if (err) return done(err);

        collection.aggregate([

          {
            $match: {
              eatenAtDate: {
                $gte: new Date("2010-01-02"),
                $lte: new Date('2016-01-03')
              }
            }
          },

          {
            $project: {
              calories: 1,
              yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$eatenAtDate"}},
              time: {$dateToString: {format: "%H%M", date: "$eatenAtDate"}}
            }
          },
          {$match: {time: {$lte: "1", $gte: "0"}}},
          {
            $group: {
              _id: {yearMonthDay: "$yearMonthDay", time: "$time"},
              totalCalories: {$sum: "$calories"}
            }
          },

          {$sort: {_id: -1}}
        ], function (err, result) {
          if (err) return done(err);

          done();
        });
      })
    });
  });


});
