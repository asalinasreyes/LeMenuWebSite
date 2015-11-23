'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
     autoIncrement = require('mongoose-auto-increment');

var config = require('../config/environment');
var connection = mongoose.createConnection(config.mongo.uri);
autoIncrement.initialize(connection);
 



var PaymentSchema = new Schema({
  order_id: String,
  payment_id: String,
  state: String,
  amount: Number,
  description: String,
  userid: { type: Schema.ObjectId, ref: 'User' },
  Restaurantid: { type: Schema.ObjectId, ref: 'Restaurant' },
  menuid: { type: Schema.ObjectId, ref: 'Menu' },
  createdat: { type: Date, default: Date.now },
  created_success: Date,
  created_cancel: Date
});

PaymentSchema.plugin(autoIncrement.plugin, {
  model: 'Payment',
  field: 'InvoicesNumber'
});


module.exports = mongoose.model('Payment', PaymentSchema);

