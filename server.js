var fs = require('fs');
var path = require('path');
var http = require('http');
var nodeStatic = require('node-static');

var fileServer = new nodeStatic.Server('./public');

var creativeDirectory = path.join(__dirname, 'public', 'creatives');
var availableCreatives = fs.readdirSync(creativeDirectory);

var port = process.env.PORT || 5000;


// Start the server
http.createServer(function (req, res) {

  if (req.url !== '/favicon.ico') {
    console.log('The URL is:', req.url);
  }

  switch (req.url) {

    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<iframe src="/showBanner" width="300" height="250" frameborder="0" />');
      break;

    case '/showBanner':

      var fileName = availableCreatives[Math.floor(Math.random() * availableCreatives.length)];
      var fileExt = fileName.split('.')[1];

      var embedCode;

      if (fileExt === 'swf') {
        embedCode = '<object width="300" height="250" data="/creatives/' + fileName + '"></object>';
      } else {
        embedCode = '<a href="http://cnn.com" target="_blank"><img src="/creatives/' + fileName + '"></a>';
      }

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body style="margin: 0;">' + embedCode + '</body></html>');
      break;

    default:
      if (req.url === '/favicon.ico') return;
      fileServer.serveFile(req.url, 200, {}, req, res).addListener('error', function(err){
        if (err) {
          console.error("Error serving " + req.url + " - " + err.message);
          res.writeHead(404, 'Not found');
          res.end('File not found - (Owen)');
        }
      });

  }


}).listen(port, '0.0.0.0');

console.log('Server running at http://0.0.0.0:' + port);


















