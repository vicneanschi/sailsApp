/**
 * User
 * @description :: Model for storing users
 */

module.exports = {
  schema: true,

  attributes: {

    email: {
      type: 'email',
      required: true,
      unique: true
    },

    password: {
      type: 'string',
      required: true
    },

    firstName: {
      type: 'string',
      defaultsTo: ''
    },

    lastName: {
      type: 'string',
      defaultsTo: ''
    },

    meals: {
      collection: 'Meal',
      via: 'owner'
    },

    dailyCaloriesLimit: {
      type: "integer",
      defaultsTo: 0
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.password;
      // delete obj.socialProfiles;

      return obj;
    }
  },

  beforeUpdate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  },

  beforeCreate: function (values, next) {
    CipherService.hashPassword(values);
    next();
  }
};
