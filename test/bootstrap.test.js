/**
 * Created by val on 2016-04-06.
 */
var sails = require('sails');
var Barrels = require('barrels');

before(function (done) {

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    },
    hooks: {
      "grunt": false
    }

    // configuration for testing purposes
    // globals: true,
    // // load almost everything but policies
    // loadHooks: ['moduleloader', 'userconfig', 'orm', 'http', 'controllers', 'services', 'request', 'responses', 'blueprints'],

  }, function (err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB
    barrels.populate(['user', 'meal'], function (err) {
      if (err)
        return done(err);

      done();
    });
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
