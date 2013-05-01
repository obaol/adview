var conn = require('./lib/redis')();
var async = require('async');

var commands = [];

// Clear everything!
commands.push(function(cb){ conn.flushall(cb); });

var organizations = [
  {id: 1, name: "AOL"},
  {id: 2, name: "appnexus"},
  {id: 3, name: "H&R Block"},
  {id: 4, name: "AT&T"},
  {id: 5, name: "Verizon"},
  {id: 6, name: "T Mobile"},
  {id: 7, name: "Nordstrom"},
  {id: 8, name: "Google"},
  {id: 9, name: "Yahoo"}
];

organizations.forEach(function(org){
  commands.push(function(cb){
    conn.hset("organizations", org.id, JSON.stringify(org), cb);
  });
});

var campaigns = [
  {id: 1, orgId: 1, name: "It's all here", creative: "48a2bbfda30a4d94bcb2ae0dedb88847.jpg", link: "http://www.aol.com"},
  {id: 2, orgId: 4, name: "Save with a reused phone", creative: "9385da39d40c4117b46aa4afe30a59d7.swf", link: "http://www.att.com"},
  {id: 3, orgId: 5, name: "Mobility solutions", creative: "fd62ff24315241c1b9d853ab11e499fd.swf", link: "http://www.verizon.com"},
  {id: 4, orgId: 3, name: "File Free Online", creative: "80c36c6c25f543bcaaf222a925f1c0d1.jpg", link: "http://www.hrblock.com"},
  {id: 5, orgId: 7, name: "Men's Shop", creative: "5c85b30cb17a4788841a36b45d0c99a9.swf", link: "http://www.nordstrom.com"},
  {id: 6, orgId: 8, name: "Google Plus", creative: "49ba8047b76345eeb863158812229548.swf", link: "http://www.google.com"},
  {id: 7, orgId: 9, name: "Small Business", creative: "f6b098688a5443408150f4db07b267bc.swf", link: "http://www.yahoo.com"},
  {id: 8, orgId: 2, name: "Developers Wanted", creative: "d640460042514336bf577c0de1e6e643.gif", link: "http://www.appnexus.com"},
  {id: 9, orgId: 6, name: "Unlimited Data", creative: "a83db15285394f8499958a3047d986ec.swf", link: "http://www.t-mobile.com"}
];

campaigns.forEach(function(campaign){
  commands.push(function(cb){
    conn.hset("campaigns", campaign.id, JSON.stringify(campaign), cb);
  });
});

// Execute commands one after the other
async.series(commands, function(err, done){
  if (err) throw new Error(err);
  console.log("Seeded Redis with data");
  process.exit(); // quit when done
});