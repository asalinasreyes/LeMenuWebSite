'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var FileUploadSchema = new Schema({
	public_id: String,
	filename: String,
	url: String
});

var MenuSchema = new Schema({
	name: String,
	active: Boolean,
	language: [String],
	files: [FileUploadSchema],
	status:String,
	Restaurantid: {
		type: Schema.ObjectId,
		ref: 'Restaurant'
	},
	userid: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	createdat: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model('Menu', MenuSchema);