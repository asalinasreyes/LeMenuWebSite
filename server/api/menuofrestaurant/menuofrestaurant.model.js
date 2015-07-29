'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MenuofrestaurantSchema = new Schema({
  name: String,
  active: Boolean,
  language:[String],
  restaurantid: { type: Schema.ObjectId, ref: 'RestaurantSchema' },
  userid: { type: Schema.ObjectId, ref: 'UserSchema' },
  created_at    : { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Menuofrestaurant', MenuofrestaurantSchema);