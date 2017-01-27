var http = require('http');
var fs = require('fs');

function readFiles(dirname, type, encoding) {
  var out = {};
  var filenames = fs.readdirSync(dirname);
  var reg = new RegExp('\.' + type + '\$');
  filenames.forEach(function(filename) {
    if(!reg.test(filename)) return;
    var file = fs.readFileSync(dirname + filename, encoding || 'utf-8');
    out['/' + filename] = file;
  });
  return out;
}

var files = readFiles(__dirname + '/', 'js');
var images = readFiles(__dirname + '/images/', 'png', 'binary');
var index = fs.readFileSync('./index.html');
var proxy = require('./proxy');

var server = http.createServer(function(req, res) {
  console.log(req.url);
  if(req.url === '/') {
    return res.end(index);
  } else
  if(req.url === '/favicon.ico') {
    return res.end('')
  } else
  if(req.url.match('/image')) {
    var url = req.url.replace('/image', '');
    var image = images[url];
    if(image) {
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(image, 'binary');
    } else {
      proxy(url, req, res);
    }
  } else
  if(req.url.match('.js')) {
    return res.end(files[req.url])
  }

});

server.listen(3000);
