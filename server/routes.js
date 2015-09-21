/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

    // Insert routes below
    app.use('/api/translatorlanguage', require('./api/translatorlanguage'));
    app.use('/api/queue', require('./api/translatorlanguage/queue'));
    app.use('/api/restaurants', require('./api/restaurant'));
    app.use('/api/restaurant/menu', require('./api/menuofrestaurant'));
    app.use('/api/payment', require('./payment'));
    app.use('/api/payments', require('./api/payment'));
    app.use('/api/invoice' , require('./api/invoice'));

    app.use('/api/dashboardinfo' , require('./api/dashboard'));
    app.use('/api/photomenus', require('./api/photomenu'));

    app.use('/api/things', require('./api/thing'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });
};
