/**
 * Seed Menus Pagos y  Traduccion Grupos de Menu Items
 * Chile 
 * Traduccion Ingles Frances
 */

'use strict';
var User = require('../api/user/user.model');
var extend = require('util')._extend;

var Restaurant = require('../api/restaurant/restaurant.model');
var MenuOfrestaurant = require('../api/menuofrestaurant/menuofrestaurant.model');
var Payment = require('../payment/payment.model');
var QueueProcess = require('../payment/QueueProcess.model');
var uuid = require('node-uuid');

var StringName = uuid.v1();


var RestaurantChile = {
    name: 'Chile Seed1 ',
    address: 'street name ' + StringName,
    country: 'cl',
    city: 'santiago',
    language: 'es',
    emailcontact: 'asdfasd@conta.cl',
    Tags: ['chile', 'peruana'],
    urlgoogleMap: 'AnyWhere'
};


var MenuRestaurantChile = {
    name: 'Verano - ' + StringName,
    active: true,
    language: ['pt', 'fr'],
    files: []
};

var fileB = {
    public_id: StringName,
    filename: 'a',
    url: 'https://s-media-cache-ak0.pinimg.com/736x/fe/f0/60/fef06047818eaec0550325010de74a09.jpg'
};

var fileA = {
    public_id: uuid.v1(),
    filename: 'a',
    url: 'https://s-media-cache-ak0.pinimg.com/236x/0b/61/f3/0b61f3c7defc56272c8eb0f1bdc6f937.jpg'
};


var Plato = [];



ItemMenuA();
ItemMenuB();
ItemMenuC();
ItemMenuD();


MenuRestaurantChile.files.push(fileA);
MenuRestaurantChile.files.push(fileB);


var newUser = {
    provider: 'local',
    role: 'owner',
    name: StringName,
    email: StringName + '@owner2.com',
    password: StringName
};

User.create(newUser, function(err, userinfo) {
    RestaurantChile.userid = userinfo._id;
    Restaurant.create(RestaurantChile, function(err, restaurant) {
        MenuRestaurantChile.userid = restaurant.userid
        MenuRestaurantChile.Restaurantid = restaurant._id;
        MenuOfrestaurant.create(MenuRestaurantChile, function(err, menu) {
            Payment.create({
                order_id: 'String2',
                payment_id: 'String1',
                state: 'success',
                amount: 11,
                description: 'Pago ' + StringName,
                userid: userinfo._id,
                Restaurantid: restaurant._id,
                menuid: menu._id,
                created_success: new Date(),
                created_cancel: new Date()
            }, function(err, pago) {
                QueueProcess.create({
                    Menuid: menu._id,
                    LanguagesTo: 'es',
                    LanguagesFrom: 'es',
                    Restaurantid: restaurant._id,
                    IsReadyToTranslate: true,
                    IsParent: true,
                    IsDoneTranslate: false,
                    MenuDetail: [{
                        NameGroupInMenu: "Entrada",
                        PositionOrder: 0,
                        ItemsInMenu: [Plato[0].es, Plato[1].es]
                    }, {
                        NameGroupInMenu: "Fondo",
                        PositionOrder: 0,
                        ItemsInMenu: [Plato[2].es, Plato[3].es]
                    }]
                }, function(err, parentQueue) {
                    var copyMenu = extend(parentQueue.MenuDetail,{}); 
                    translateFR(copyMenu);
                    QueueProcess.create({
                        Menuid: menu._id,
                        LanguagesTo: 'fr',
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: true,
                        Restaurantid: restaurant._id,
                        IsParent: false,
                        IsDoneTranslate: true,
                        Parentid: parentQueue._id,
                        MenuDetail: copyMenu
                    }, function(err, listquee) {});
                    
                    var copyMenu = extend(parentQueue.MenuDetail,{}); 
                    translatePT(copyMenu);
                    QueueProcess.create({
                        Menuid: menu._id,
                        LanguagesTo: 'en',
                        Restaurantid: restaurant._id,
                        LanguagesFrom: 'es',
                        IsReadyToTranslate: true,
                        IsParent: false,
                        IsDoneTranslate: true,
                        Parentid: parentQueue._id,
                        MenuDetail: copyMenu
                    }, function(err, listquee) {});
                });
            });
        });
    })
});


function translateFR(group) {
    for (var ii = 0; ii < group.length; ii++) {
        for (var i = 0; i < group[ii].ItemsInMenu.length; i++) {
            for (var iz = 0; iz < Plato.length; iz++) {
                if (Plato[iz].es.DescriptionItemMenu == group[ii].ItemsInMenu[i].DescriptionItemMenu) {
                    group[ii].ItemsInMenu[i].DescriptionItemMenu = Plato[iz].fr.DescriptionItemMenu;
                    group[ii].ItemsInMenu[i].DescriptionItemsItemMenu = Plato[iz].fr.DescriptionItemsItemMenu;
                    group[ii].ItemsInMenu[i].NameItemMenu = Plato[iz].fr.NameItemMenu;
                };
            };
        };
    };
}


function translatePT(group) {

    for (var ii = 0; ii < group.length; ii++) {
        for (var i = 0; i < group[ii].ItemsInMenu.length; i++) {
            for (var iz = 0; iz < Plato.length; iz++) {
                if (Plato[iz].fr.DescriptionItemMenu == group[ii].ItemsInMenu[i].DescriptionItemMenu) {
                    group[ii].ItemsInMenu[i].DescriptionItemMenu = Plato[iz].pt.DescriptionItemMenu;
                    group[ii].ItemsInMenu[i].DescriptionItemsItemMenu = Plato[iz].pt.DescriptionItemsItemMenu;
                    group[ii].ItemsInMenu[i].NameItemMenu = Plato[iz].pt.NameItemMenu;
                };
            };
        };
    };
}

function ItemMenuA() {
    Plato[0] = {
        es: {
            DescriptionItemMenu: "Tomate cebolla",
            DescriptionItemsItemMenu: "Tomate, ceboola y Aceite",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Chilena"
        },
        fr: {
            DescriptionItemMenu: "Tomate Oignon",
            DescriptionItemsItemMenu: "Tomate, oignon, huile d'olive",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Chilien"
        },
        pt: {
            DescriptionItemMenu: "Tomate Cebola",
            DescriptionItemsItemMenu: "Tomate, Cebola e azeite",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Chilena"
        }
    };
}

function ItemMenuB() {
    Plato[1] = {
        es: {
            DescriptionItemMenu: "Tomate",
            DescriptionItemsItemMenu: "tomate solo",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Tomate Solo"
        },
        fr: {
            DescriptionItemMenu: "Tomate",
            DescriptionItemsItemMenu: "Tomate",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Tomate"
        },
        pt: {
            DescriptionItemMenu: "Tomate",
            DescriptionItemsItemMenu: "Sol Tomate",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Sol Tomate"
        }
    };
}


function ItemMenuC() {
    Plato[2] = {
        es: {
            DescriptionItemMenu: "Cazuela",
            DescriptionItemsItemMenu: "Cazuela",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Cazuela"
        },
        fr: {
            DescriptionItemMenu: "Issue du mélange de la cuisine espagnole traditionnelle et locale, la cazuela est un bouillon de bœuf, de poulet ou de fruits de mer agrémenté de pommes de terre, de potirons ou de maïs.",
            DescriptionItemsItemMenu: "bœuf , oignon,morceau de potiron, épis de maïs,pommes de terre par personne, verre de riz, poivron,  verre de haricot blanc,  œuf, du persilde, l’origan,de l’huile d’olive, de la coriandre fraîche",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Cazuela"
        },
        pt: {
            DescriptionItemMenu: "Após a mistura de cozinha tradicional espanhola e local, cazuela é um caldo de carne , frango ou batatas decorado frutos do mar , abóbora ou milho ",
            DescriptionItemsItemMenu: "carne , a cebola, o pedaço de abóbora, espiga de milho , batatas por pessoa , copo de arroz , pimenta , vidro feijão branco , ovo, persilde , orégano , azeite, coentro fresco",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Cazuela"
        }
    };
}

function ItemMenuD() {
    Plato[3] = {
        es: {
            DescriptionItemMenu: "Humita",
            DescriptionItemsItemMenu: "Humieta",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Humita"
        },
        fr: {
            DescriptionItemMenu: "Humita, Maïs à la chilienne ",
            DescriptionItemsItemMenu: "épis de maïs frais (avec leurs feuilles), oignons, petit piment rouge,tiges de basilic frais, Huile de tournesol , lait, Sel, poivre",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Humitas, Maïs à la chilienne"
        },
        pt: {
            DescriptionItemMenu: "Pamonha Chilena",
            DescriptionItemsItemMenu: "Milho na espiga com a palha, Cebola picada, Pimentão vermelho picado, Tomate concassé, Tomate salada, Açúcar refinado, Páprica picante, Canela, Cominho, Manteiga, Fundo de legumes, Sal, Qb, Barbante",
            PriceItemsItemMenu: "2500",
            PositionOrder: 0,
            NameItemMenu: "Humitas, Pamonha Chilena"
        }
    };
}


function getData(menu) {

};
