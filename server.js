var fs = require('fs');
var url = require('url');
var path = require('path');
var http = require('http');
var jade = require('jade');
var async = require('async');
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

var auth = express.basicAuth('admin', 'password');


// ---
// API
// ---

// Get all campaign data
app.get('/api/campaigns', function(req, res){
  conn.hgetall('campaigns', function(err, data){

    // Create a new array to hold campaign objects
    var campaigns = [];

    // Loop through each JSON String and convert to an Object
    for (var key in data) {
      var thisRecord = data[key];
      campaigns.push(JSON.parse(thisRecord));
    }

    // Get the stats for EVERY campaign
    var commands = campaigns.map(function(campaign){
      return function(cb) { getStats(campaign.id, cb); };
    });

    async.parallel(commands, function(err, data){

      var campaignsWithStats = campaigns.map(function(campaign, i){

        var stats = data[i];
        campaign.impressions = stats.impressions;
        campaign.clicks = stats.clicks;

      });

      // Respond with the array of objects
      res.json(campaigns);

    });

  });
});

// Get ONE campaign
app.get('/api/campaigns/:id', function(req, res){
  conn.hget('campaigns', req.params.id, function(err, data){
    res.send(data);
  });
});

// Get both impressions and clicks for a given campaign id
app.get('/api/campaignStats/:id', function(req, res){
  getStats(req.params.id, function(err, data) {
    res.json(data);
  });
});

function getStats(campaignId, cb) {
  var commands = [];

  // Get impressions
  commands.push(function(cb) { conn.get('impressions:count:' + campaignId, cb); });

  // Get clicks
  commands.push(function(cb) { conn.get('clicks:count:' + campaignId, cb); });

  async.parallel(commands, function(err, data){
    cb(null, {
      impressions: Number(data[0] || 0),
      clicks:      Number(data[1] || 0)
    });
  });
}


// --------
// Admin UI
// --------

app.get('/admin*', auth, function(req, res){
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
      var link = '/trackClick/' + campaign.id;
      var embedCode = renderAd(fileName, link);

      // Used to be res.end() but changed to res.send()
      res.send('<html><body style="margin: 0;">' + embedCode + '</body></html>');

      // Track the impression
      conn.incr('impressions:count');
      conn.incr('impressions:count:' + campaign.id);

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

      // Track the click
      conn.incr('clicks:count');
      conn.incr('clicks:count:' + campaign.id);

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



