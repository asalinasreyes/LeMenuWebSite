'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var FileUploadSchema = new Schema({
	public_id: String,
	filename: String,
	url: String
});

var MenuofrestaurantSchema = new Schema({
	name: String,
	active: Boolean,
	language: [String],
	files: [FileUploadSchema],
	restaurantid: {
		type: Schema.ObjectId,
		ref: 'RestaurantSchema'
	},
	userid: {
		type: Schema.ObjectId,
		ref: 'UserSchema'
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model('Menuofrestaurant', MenuofrestaurantSchema);