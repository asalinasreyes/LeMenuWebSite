'use strict';

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


exports.create = function (req, res) {
  var file = req.files.file;
  var filename = req.files.file.name;
  cloudinary.uploader.upload(file.path, function (result) {
    if (result.url) {
       return res.json(200,  { public_id:result.public_id, url: result.url, filename:filename});
    } else {
       return res.send(404);
    }
  });

};