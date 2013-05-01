var redis = require('redis');
var url = require('url');

module.exports = function() {

  var conn;
  var rtgUrl = process.env.REDISTOGO_URL;

  // If Heroku
  if (rtgUrl) {
    var rtg = url.parse(rtgUrl);
    conn = redis.createClient(rtg.port, rtg.hostname);
    conn.auth(rtg.auth.split(':')[1]);
  
  // Else, we're developing locally
  } else {
    conn = redis.createClient();
  }

  return conn;

};