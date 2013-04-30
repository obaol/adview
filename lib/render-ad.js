module.exports = function(fileName, link) {

  var fileExt = fileName.split('.')[1];

  var embedCode;

  var clickTags = ['clickTag', 'clickTAG', 'ClickTag'].map(function(tag){
    return tag + '=' + link;
  }).join('&');

  var flashUrl = fileName + '?' + clickTags;

  if (fileExt === 'swf') {
    embedCode = '<object width="300" height="250"><param name="movie" value="' + flashUrl + '"><param name="allowScriptAccess" value="always"><embed src="' + flashUrl + '" quality="high" type="application/x-shockwave-flash" width="300" height="250" /></object>';
  } else {
    embedCode = '<a href="' + link + '" target="_blank"><img src="' + fileName + '"></a>';
  }

  return embedCode;

};
