function Stats(o) {
  this.keys.call(o, (key, val) => this[key] = val);
}

Stats.container = document.getElementById('stats');
Stats.container.clear = function() {
  return this.innerHTML = '';
}
Stats.prototype.keys = function(fn) {
  if(!fn) return Object.keys(this);
  return Object.keys(this).map((key) => fn(key, this[key]));
}

Stats.prototype.render = function() {
  Stats.container.clear();
  this.keys((key, val) => {
    var input = new Input('text', this, key, val);
    Stats.container.appendChild(input.container);
  })
}
