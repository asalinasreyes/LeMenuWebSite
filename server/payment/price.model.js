'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;



var PriceSchema = new Schema({
  price: Number,
  typeserviceid: String,
  typeservicedescription: String,
  created_time: { type: Date, default: Date.now },
  validFrom: Date,
  validTo: Date
});

module.exports = mongoose.model('PriceList', PriceSchema);

