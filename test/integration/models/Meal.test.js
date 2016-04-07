/**
 * Created by val on 2016-04-06.
 */
var expect = require('chai').expect;

describe('MealModel', function () {

    describe('#create()', function () {
        it('should create meal', function (done) {
            Meal.create({
                    title: "branch",
                    calories: 1,
                    eatenAtDate: '1980-01-01 21:03',
                    eatenAtTime: 1,
                    owner: 1
                })
                .then(function (meal) {
                    expect(meal.eatenAtDate).be.eql(new Date('1980-01-01 21:03'));
                    done();
                })
                .catch(done);
        });
    });

});