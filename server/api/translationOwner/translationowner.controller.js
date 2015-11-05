'use strict';

var _ = require('lodash');
var Restaurant = require('../restaurant/restaurant.model');
var QueueTranslate = require('../../payment/QueueProcess.model');

var http = require('http');
var fs = require('fs');
var path = require('path');

// Get list of Restaurants
exports.index = function(req, res) {

    var ObjectId = require('mongoose').Types.ObjectId;
    var user_id = new ObjectId(req.user._id);
    Restaurant.find({
        'userid': user_id
    }, {
        _id: 1
    }, function(err, restaurants) {
        if (err) {
            return handleError(res, err);
        }
        var arrayResto = [];
        restaurants.map(function(resto) {
            var restoID = new ObjectId(resto._id);
            arrayResto.push(restoID);
        });

        var search = {
            'Restaurantid': {
                $in: arrayResto
            },
            'IsParent': false
        };
        var returnFields = {
            LanguagesTo: '',
            StartTranslate: '',
            EndTranslate: '',
            IsReadyToTranslate: '',
            IsDoneTranslate: '',
            Menuid: '',
            Restaurantid: ''
        };


        QueueTranslate.find(search, returnFields).populate('Menuid', 'name').populate('Restaurantid', 'name').exec(function(err, listQueue) {
            return res.status(200).json(listQueue);
        });

    });

};


exports.getFile = function(req, res) {
    
    console.log('Request body', req.body);

    /*
Request body { restoInfo:
   { EndTranslate: '2015-11-05T03:50:03.835Z',
     IsDoneTranslate: true,
     IsReadyToTranslate: true,
     LanguagesTo: 'us',
     Menuid: { _id: '563ad0979eceda5c053f44e9', name: 'dfsdadf' },
     Restaurantid: { name: 'sdfsad', _id: '563ad06b9eceda5c053f44e8' },
     StartTranslate: '2015-11-05T03:50:42.190Z',
     _id: '563ad0e39eceda5c053f44ed' } }
     
    */

    var pathBase = path.normalize(__dirname + '/../../..');
    var pathToDownload =  '/client/assets/download/';
    var filename = 'onefile.txt';
    var pathFolderDownloads = path.join(pathBase, pathToDownload , filename );

    var stream = fs.createWriteStream(pathFolderDownloads);
    stream.once('open', function(fd) {
        stream.write("My first row\n");
        stream.write("My second row\n");
        stream.end();
    });

    var pathVirtual = '/assets/download/';
    res.status(200).json({name:filename, fullpath: pathVirtual + filename});
};


exports.getFilePipe = function(req, res) {

    var pathFolderDownloads = path.join(path.normalize(__dirname + '/../../..'), '/client/assets/download/', 'onefile.txt');

    var stream = fs.createWriteStream(pathFolderDownloads);
    stream.once('open', function(fd) {
        stream.write("My first row\n");
        stream.write("My second row\n");
        stream.end();
    });

    var stat = fs.statSync(pathFolderDownloads);

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(pathFolderDownloads);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res );


};


exports.getFileWriteHead = function(req, res) {
  
  var writeStream = fs.createWriteStream('./output');

  // This pipes the POST data to the file
  req.pipe(writeStream);

  // After all the data is saved, respond with a simple html form so they can post more data
  req.on('end', function () {
    res.writeHead(200, {"content-type":"text/plain"});
    res.end('<form method="POST"><input name="test" /><input type="submit"></form>');
  });

  // This is here incase any errors occur
  writeStream.on('error', function (err) {
    console.log(err);
  });

    return res.status(200);
}
