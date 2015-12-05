'use strict';

var User = require('../api/user/user.model');
var translator = require('../api/translatorlanguage/translatorlanguage.model');

// Creacion de un Traductor

/*
User.create({
    provider: 'local',
    role: 'translator',
    name: 'translate uno',
    email: 'todos@todos.com',
    password: 'todos'
}, function(err, usernew) {
    translator.create({
        active: true,
        userid: usernew._id,
        languages: ['es', 'en', 'pt', 'fr', 'us', 'br']
    }, function(err, newtranslator) {

    })
});
*/
createUserTranslator('todos',['es', 'en', 'pt', 'fr', 'us', 'br']);
createUserTranslator('camille',['es', 'en',  'fr']);
createUserTranslator('alexis',['es', 'pt',  'fr']);
createUserTranslator('clinton',['es', 'en']);


createUserOwner('owner');
createUserOwner('enchile');
createUserOwner('enargentina');
createUserOwner('enbrasil');
createUserOwner('enfrancia');


//Creacion del Administrador
User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
}, function() {
    //console.log('Creo el admin Default');
});

function createUserOwner(nameUser) {
    var newUser = {
        provider: 'local',
        role: 'owner',
        name: nameUser,
        email: nameUser + '@owner.com',
        password: 'pass'
    };
    User.create(newUser, function(err, userinfo) {});
}



function createUserTranslator(nameUser, languages) {
    User.create({
        provider: 'local',
        role: 'translator',
        name: nameUser,
        email: nameUser+'@translator.com',
        password: 'pass'
    }, function(err, usernew) {
        translator.create({
            active: true,
            userid: usernew._id,
            languages: languages
        }, function(err, newtranslator) {

        })
    });

}
