var should = require('should');
var renderAd = require('../lib/render-ad.js');

describe('Rendering an ad', function(){

  it('should output an OBJECT tag for a SWF file', function(){
    var output = renderAd('myflashfile.swf');
    output.should.include('<object');
  });

  it('should output an IMG tag for everything else', function(){
    var output = renderAd('myflashfile.jpg');
    output.should.include('<img');
  });

  it('should show the correct link for IMAGE files', function(){
    var output = renderAd('myflashfile.jpg', 'http://www.aol.com');
    output.should.include('href="http://www.aol.com"');
  });

  it('should show the correct link for FLASH files', function(){
    var output = renderAd('/creatives/myflashfile.swf', 'http://cnn.com');
    output.should.include('src="/creatives/myflashfile.swf?clickTag=http://cnn.com&clickTAG=http://cnn.com&ClickTag=http://cnn.com"');
  });

});
