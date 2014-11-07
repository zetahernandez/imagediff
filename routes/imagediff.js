var express = require('express');
var imagediff = require('../lib/imagediff');
var request = require('request');
var async = require('async');
var temp = require('temp');
var base64 = require('base64-stream');
var fs = require('fs');
var router = express.Router();


function downloadFile(url, callback) {
  
  var outputFile = temp.path({
    suffix: '.png'
  });
  
  var writeStream = fs.createWriteStream(outputFile);
  var r = request(url,function(err, res, req) { 
    if(err || res.statusCode !== 200){
      return callback('error downloading ' + url);
    }
  }).pipe(writeStream);

  writeStream.on('error', function(err) {
    callback(err);
  });

  r.on('finish', function() {
    callback(null, outputFile);
  });

  r.on('end', function() {
    callback(null, outputFile);
  });

  r.on('error', function(err) {
    callback(err);
  });

  r.on('data', function() {
    console.log("downloading...");
  });
}

/* GET users listing. */
router.post('/', function(req, res) {

  async.parallel({
      fimg: function(callback) {
        downloadFile(req.body.fimg, callback);
      },
      simg: function(callback) {
        downloadFile(req.body.simg, callback);
      },
    },
    function(err, results) {
      if (err) {
        return res.json({error: err});
      }
      console.log(err);
      console.log(results);
      var options = {
        fimg: results.fimg,
        simg: results.simg
      };
      imagediff(options, function(err, output) {
        res.status(200);
        fs.createReadStream(output.path).pipe(base64.encode()).pipe(res);
        
      });
    });
});

module.exports = router;