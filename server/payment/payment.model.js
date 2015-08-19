'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var PaymentSchema = new Schema({

  order_id: String,
  user_id: String,
  payment_id: String,
  state: String,
  amount: String,
  description: String,
  userid: { type: Schema.ObjectId, ref: 'UserSchema' },
  restaurantid: { type: Schema.ObjectId, ref: 'RestaurantSchema' },
  menuid: { type: Schema.ObjectId, ref: 'MenuSchema' },
  created_time: { type: Date, default: Date.now },
  created_Finished: Date
});

module.exports = mongoose.model('Payment', PaymentSchema);