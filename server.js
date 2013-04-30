var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var nodeStatic = require('node-static');

var renderAd = require('./lib/render-ad.js');

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
      var embedCode = renderAd('/creatives/' + fileName, 'http://bing.com');

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body style="margin: 0;">' + embedCode + '</body></html>');
      break;

    default:
      if (req.url === '/favicon.ico') return;
      var fileName = url.parse(req.url).pathname;
      fileServer.serveFile(fileName, 200, {}, req, res).addListener('error', function(err){
        if (err) {
          console.error("Error serving " + req.url + " - " + err.message);
          res.writeHead(404, 'Not found');
          res.end('File not found - (Owen)');
        }
      });

  }


}).listen(port, '0.0.0.0');

console.log('Server running at http://0.0.0.0:' + port);


















