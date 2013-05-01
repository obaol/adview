var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var jade = require('jade');
var express = require('express');
var conn = require('./lib/redis')();

var renderAd = require('./lib/render-ad.js');


// Make a new app instance
var app = express();

app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());


// ---
// API
// ---

app.get('/api/campaigns', function(req, res){
  conn.hgetall('campaigns', function(err, data){

    // Create a new array to hold campaign objects
    var campaigns = [];

    // Loop through each JSON String and convert to an Object
    for (var key in data) {
      var thisRecord = data[key];
      campaigns.push(JSON.parse(thisRecord));
    }

    // Respond with the array of objects
    res.json(campaigns);

  });

});


// --------
// Admin UI
// --------

app.get('/admin*', function(req, res){
  res.render('index.jade');
});

app.get('/template/:name', function(req, res){
  res.render('templates/' + req.params.name + '.jade');
});


// ---------
// Serve Ads
// ---------

app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<iframe src="/showBanner" width="300" height="250" frameborder="0" />');
});

app.get('/showBanner', function(req, res) {

  // Get all available ads to serve
  conn.hkeys('campaigns', function(err, availableKeys){

    // Select an ad at random
    var key = availableKeys[Math.floor(Math.random() * availableKeys.length)];

    // Pull details of this ad from Redis
    conn.hget('campaigns', key, function(err, data){

      var campaign = JSON.parse(data);
      var fileName = '/creatives/' + campaign.creative;
      var embedCode = renderAd(fileName, campaign.link);

      // Used to be res.end() but changed to res.send()
      res.send('<html><body style="margin: 0;">' + embedCode + '</body></html>');

    });
  });
});

app.get('/trackClick/:id', function(req, res){

  var key = req.params.id;

  // Pull details of this ad from Redis
  conn.hget('campaigns', key, function(err, data){

    var link;

    if (data) {
      var campaign = JSON.parse(data);
      link = campaign.link;
    } else {
      link = 'http://www.aolnetworks.com';
    }

    res.writeHead(302, {'Location': link});
    res.end();

  });

});


// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



