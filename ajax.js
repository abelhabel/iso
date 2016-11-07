var ajax = function ajax(options) {
  return new Promise(function(resolve, reject) {
    if(typeof options != 'object') return null;
    var a = new XMLHttpRequest();

    a.open(options.method, options.url, true);

    if(options.blob) {
      a.responseType = "blob";
      a.setRequestHeader("Content-type", "binary");
    } else
    if(options.headers && options.headers['Content-Type']) {
      a.setRequestHeader("Content-type", options.headers['Content-Type']);
    } else {
      a.setRequestHeader("Content-type", "application/json");
    }

    a.onreadystatechange = function() {
      if(a.readyState === 4) {
        if(a.status === 200) {
          if(options.json) return resolve(JSON.parse(a.responseText));
          if(options.blob) {
            // var blob = new Blob([a.response], {type: "image/png"});
            return resolve(a.response);
          }
          resolve(a.responseText);
        } else {
          reject(a.responseText);
        }
      }
    };
    var body = options.body ? JSON.stringify(options.body) : null;
    a.send(body);
  });
};
