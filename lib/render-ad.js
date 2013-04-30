module.exports = function(fileName, link) {

  var fileExt = fileName.split('.')[1];

  var embedCode;

  var clickTags = ['clickTag', 'clickTAG', 'ClickTag'].map(function(tag){
    console.log(tag);
  });

  if (fileExt === 'swf') {
    embedCode = '<object width="300" height="250" data="/creatives/' + fileName + '"></object>';
  } else {
    embedCode = '<a href="http://cnn.com" target="_blank"><img src="/creatives/' + fileName + '"></a>';
  }

  return embedCode;

};

