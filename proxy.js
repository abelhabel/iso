var http = require('http'),
    url = require('url');

module.exports = function (url, req, res, next) {
    var options = {
        uri: url
    };

    var callback = function(response) {
        if (response.statusCode === 200) {
            res.writeHead(200, {
                'Content-Type': response.headers['content-type']
            });
            response.pipe(res);
        } else {
            res.writeHead(response.statusCode);
            res.end();
        }
    };
    http.get(url, callback);
};
