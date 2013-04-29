var http = require('http');
var nodeStatic = require('node-static');

var fileServer = new nodeStatic.Server('./public');

// Start the server
http.createServer(function (req, res) {

  if (req.url !== '/favicon.ico') {
    console.log('The URL is:', req.url);
  }

  switch (req.url) {

    case '/showBanner':
      console.log('Serving banner');
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<html><body style="margin: 0;"><img src="/creatives/d640460042514336bf577c0de1e6e643.gif"></body></html>');
      break;

    case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<iframe src="/showBanner" width="300" height="250" frameborder="0" />');
      break;

    default:
      if (req.url === '/favicon.ico') return;
      fileServer.serveFile(req.url, 200, {}, req, res, function(){});

  }


}).listen(1337, '0.0.0.0');

console.log('Server running at http://127.0.0.1:1337/');


















