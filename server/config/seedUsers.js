'use strict';

var User = require('../api/user/user.model');
var translator = require('../api/translatorlanguage/translatorlanguage.model');

// Creacion de un Traductor
User.create({
    provider: 'local',
    role: 'translator',
    name: 'translate uno',
    email: 'uno@uno.com',
    password: 'uno'
}, function(err, usernew) {
    translator.create({
        active: true,
        userid: usernew._id,
        languages: ['es', 'en', 'pt', 'fr']
    }, function(err, newtranslator) {
        console.log('Traductor Creado', usernew, newtranslator);
    })
});



//Creacion del Administrador
User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
}, function() {
    console.log('Creo el admin Default');
});

