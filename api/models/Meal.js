/**
 * Meal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,

  attributes: {
    title: {
      type: "text",
      required: true
    },
    calories: {
      type: "integer",
      required: true
    },
    eatenAtDate: {
      type: "date",
      required: true
    },
    eatenAtTime: {
      type: "integer",
      required: true,
      min: 0,
      max: 2359
    },
    owner: {
      model: 'User',
      required: true,
      index: true
    }

  },

  beforeUpdate: function (values, next) {
    // console.log('beforeUpdate', values.eatenAtDate);
    // values.eatenAtDate.setHours(0, 0, 0, 0);
    // console.log('beforeUpdate changed', values.eatenAtDate);
    next();
  },

  beforeCreate: function (values, next) {
    // console.log('beforeCreate', values.eatenAtDate);
    // values.eatenAtDate.setHours(0, 0, 0, 0);
    // console.log('beforeCreate changed', values.eatenAtDate);
    next();
  }

};

