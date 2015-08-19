'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var Payment = require('./payment.model');
var Restaurant = require('../api/restaurant/restaurant.model');

var paypal = require('paypal-rest-sdk');
var uuid = require('node-uuid');
var config = require('../config/environment');

var MenuTranslate = require('../api/menuofrestaurant/menuofrestaurant.model')

var MenuSchemaTranslate


 var messageErrorObject;

paypal.configure(config.paypal);


exports.startPayment = function(req, res) {


	var order_id = uuid.v4();
	var ObjectId = require('mongoose').Types.ObjectId;

	var total = req.query.order_amount;

	var user_id = new ObjectId(req.query.user_id);
	var restaurant_id = new ObjectId(req.query.restaurant);
	var menu_id = new ObjectId(req.query.menu);

	var paypalPayment = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {},
		"transactions": [{
			"amount": {
				"currency": "USD",
				"total": total
			},
			"description": "Traduccion"
		}]
	};


	paypalPayment.redirect_urls.return_url = config.paypal.return_url + order_id;
	paypalPayment.redirect_urls.cancel_url =  config.paypal.cancel_url + order_id;

	console.log(paypalPayment);

	paypal.payment.create(paypalPayment, {}, function(err, resp) {
		if (err) {
			res.send(500, err);
		}

		if (resp) {

			var paymentOrder = new Payment({
				order_id: order_id,
				user_id: user_id,
				payment_id: resp.id,
				state: resp.state,
				amount: total,
				restaurantid: restaurant_id,
				menuid: menu_id,
				description: 'description pendiente'
			});

			paymentOrder.save(function(err) {
				if (err) {
					res.send(500, err);
				} else {
					var link = resp.links;
					for (var i = 0; i < link.length; i++) {
						if (link[i].rel === 'approval_url') {
							res.redirect(link[i].href);
						}
					}
				}
			})
		}
	});
};


exports.orderExecute = function(req, res) {

	var order_id = req.query.order_id;

	var payer = {
		payer_id: req.query.PayerID
	};

	Payment.findOne({
		order_id: order_id
	}, function(err, order) {
		paypal.payment.execute(order.payment_id, payer, {}, function(err, resp) {
			if (err) {
				console.log(err);
				res.send(500, err);
			} else {
				order.state = resp.state;
				var isOneupdated = false;
				order.created_Finished = new Date();
				order.save(function(err) {
					Restaurant.findOne({_id: order.restaurantid}, function(err, restaurant) {
						for (var i = 0; i < restaurant.menu.length; i++) {
							if (restaurant.menu[i]._id.equals(order.menuid)) {
								restaurant.menu[i].payed=true;
								restaurant.menu[i].starttranslate=false;
								isOneupdated=true;


							};
						};
						if (isOneupdated) {
							restaurant.save(function(err){
								if (err) {
									res.send(500, err);
								}else{
									res.redirect('/invoice');
								}
								
							});
						}
					});
				});
			}
		});
	});
};
