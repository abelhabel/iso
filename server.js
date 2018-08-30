var http = require('http');
var fs = require('fs');
var URL = require('url').URL;
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
  var url = new URL('http://home.com:3000' + req.url);
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
  } else
  if(req.url.match('saveProject')) {
    var id = url.searchParams.get('id');
    var stream = fs.createWriteStream(__dirname + '/projects/' + id + '.json');
    req.pipe(stream);
    stream.on('finish', () => {
      console.log('write file done')
      stream.close();
      res.end();
    })
  } else
  if(req.url.match('loadProject')) {
    var id = url.searchParams.get('id');
    var stream = fs.createReadStream(__dirname + '/projects/' + id + '.json');
    res.writeHead(200, {'Content-Type': 'application/json'})
    stream.pipe(res);
    stream.on('end', () => {
      console.log('read file done')
      stream.close();
    })
  }

});

server.listen(3000);
