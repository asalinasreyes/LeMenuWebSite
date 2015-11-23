'use strict';


var ALL_PROCESS_FAKE = true;
var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');

var cloudinary = require('cloudinary');
var fileParser = require('connect-multiparty')();

var cloudinaryCredentials = {
  cloud_name: 'alexis-salinas-reyes',
  api_key: '242963977117369',
  api_secret: 'rSlU2GkKwhM-pkleqxQWFJT_wv8'
};
cloudinary.config({
  cloud_name: cloudinaryCredentials.cloud_name,
  api_key: cloudinaryCredentials.api_key,
  api_secret: cloudinaryCredentials.api_secret
});


exports.create = function(req, res) {
  console.log('UploadImage Process Request', req);
  if (ALL_PROCESS_FAKE) {
    ReturnFakeImageProcess(req, res);
  } else {
    ProcessImageCloudinary(req, res);
  }
};

function ProcessImageCloudinary(req, res) {
  var file = req.files.file;
  var filename = req.files.file.name;
  cloudinary.uploader.upload(file.path, function(result) {
    if (result.url) {
      return res.json(200, {
        public_id: result.public_id,
        url: result.url,
        filename: filename
      });
    }
  });
};

function ReturnFakeImageProcess(req, res) {
  var file = req.files.file;
  var filename = req.files.file.name;
  var NewStringName = uuid.v1() + '-' + filename;
  var pathBase = path.normalize(__dirname + '/../../..');
  var pathToDownload = '/client/assets/download/';
  if (process.env.NODE_ENV=='production') {
    pathToDownload = '/public/assets/download/';
  }
  
  var pathFolderDownloads = path.join(pathBase, pathToDownload, NewStringName);

  console.log('image desde ', file.path);
  console.log('image hasta ', pathFolderDownloads);
  fs.createReadStream(file.path).pipe(fs.createWriteStream(pathFolderDownloads));

  return res.json(200, {
    public_id: NewStringName,
    url: '/assets/download/'+NewStringName,
    filename: NewStringName,
    error: "OffLine"
  });
};