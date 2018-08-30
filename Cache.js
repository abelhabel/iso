function Cache(name, Model) {
  this.name = name;
  this.Model = Model;
  this.mem = Cache.load(name, Model) || {};
}

Cache.load = function(cache, Model) {
  var store;
  try {
    store = JSON.parse(localStorage[cache]);
    if(Model) Object.keys(store).forEach((o) => new Model(store[o]))
  } catch(err) {
    // console.log('could not parse json when loading', cache, err);
  }

  return store;
}

Cache.save = function(cache, data) {
  localStorage[cache] = JSON.stringify(data);
}

Cache.get = function(cache, name) {
  var store;
  try {
    store = JSON.parse(localStorage[cache]);
  } catch(err) {
    console.log('could not parse json');
  }
  return store && store[name];
}

Cache.set = function(cache, name, value) {
  if(!localStorage[cache]){
    localStorage[cache] = "{}";
  }
  var store = JSON.parse(localStorage[cache]);
  store[name] = value;
  localStorage[cache] = JSON.stringify(store);
}

Cache.remove = function(cache, name) {
  var c = Cache.load(cache);
  delete c[name];
  Cache.save(cache, c);
}

Cache.prototype.get = function(key) {
  return this.mem[key] || Cache.get(this.name, key);
}

Cache.prototype.set = function(key, val) {
  this.mem[key] = val;
  return Cache.set(this.name, key, val);
}

Cache.prototype.remove = function(key) {
  var yes = confirm('Sure you want to remove this?');
  if(yes) {
    delete this.mem[key];
    Cache.remove(this.name, key);
  }
  return yes;
}

Cache.prototype.render = function() {
  Object.keys(this.mem).forEach((key) => new this.Model(this.mem[key]).render() );
  return this;
}


Cache.prototype.renderList = function(container, onSelect) {
  var store = this.mem || Cache.load(this.name);
  if(!store) return;
  var list = Object.keys(store).map((name) => {
    var div = document.createElement('div');
    div.textContent = name;
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      div.style.backgroundColor = 'lightgray';
      list.forEach((d) => delete div.style.backgroundColor)
      onSelect(store[name])
    }, false);
    if(container) container.appendChild(div);
    return div;
  })
  return list;
}
