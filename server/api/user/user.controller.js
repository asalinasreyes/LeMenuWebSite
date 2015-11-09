'use strict';

var User = require('./user.model');
var Translator = require('../translatorlanguage/translatorlanguage.model');

var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {


    Translator.find({})
        .populate('userid')
        .exec(function(err, users) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, users);
        });

    /*
    User.find({}, '-salt -hashedPassword', function (err, users) {
      if(err) return res.send(500, err);
      res.json(200, users);
    });
    */
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'owner';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({
            _id: user._id
        }, config.secrets.session, {
            expiresInMinutes: 60 * 5
        });
        res.json({
            token: token
        });
    });
};


exports.createTranslator = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'translator';

    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var translator = new Translator({
            active: true,
            userid: user._id,
            languages: req.body.languages
        });
        console.log('translator info', translator);
        translator.save(function(err, translatorinfo) {
            console.log('Creado', translatorinfo);
        });
        res.json(200, {});
    });
};

/// Update Translator Name, Email and Languages
exports.UpdateTranslator = function(req, res, next) {
    User.findById(req.body.userid, function(err, userdata) {
        if (err) {
            if (err) return validationError(res, err);
        }
        userdata.name = req.body.name;
        userdata.email = req.body.email;
        userdata.save(function(err, data) {
            if (err) {
                return validationError(res, err);
            }
            Translator.findById(req.body.translateid, function(err, tranlatordata) {
                if (err) {
                    if (err) return validationError(res, err);
                };
                tranlatordata.languages = req.body.languages;
                tranlatordata.save(function(err, data) {
                    console.log('translator update', data);
                });
                res.json(200, {});
            });
        });
    });
};


exports.createAdmin = function(req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'admin';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        res.json(200, {});
    });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function(err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if (err) return res.send(500, err);
        return res.send(204);
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function(err, user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
    }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};