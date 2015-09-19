'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var PaymentSchema = new Schema({

  order_id: String,
  payment_id: String,
  state: String,
  amount: String,
  description: String,
  userid: { type: Schema.ObjectId, ref: 'User' },
  Restaurantid: { type: Schema.ObjectId, ref: 'Restaurant' },
  menuid: { type: Schema.ObjectId, ref: 'Menu' },
  createdat: { type: Date, default: Date.now },
  created_success: Date,
  created_cancel: Date
});


module.exports = mongoose.model('Payment', PaymentSchema);

