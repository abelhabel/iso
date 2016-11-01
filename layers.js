function Layer(name, screen) {
  this.id = uniqueId();
  this.container = document.createElement('div');
  this.container.className = 'layer';
  this.name = name;
  this.container.textContent = this.name;
  this.screen = screen;
  Layer.layers.push(this);
}

Layer.layers = [];

Layer.container = document.getElementById('layers')

Layer.prototype.render = function() {
  Layer.container.appendChild(this.container);
};

Layer.prototype.on = function(event, fn) {
  var handler = (e) => fn(e, this);
  this.container.addEventListener(event, handler, false);
  return handler;
};

Layer.prototype.detach = function(event, fn) {
  this.container.removeEventListener(event, fn);
}

Layer.prototype.drawGrid = function() {
  var p = new Polygon(0,0,40,6);
  var ox = -100;
  p.fillStyle = 'rgba(1,1,1,0.2)';
  p.strokeStyle = 'rgba(1,1,1,0.3)';

  var grid = [];

  for(var i = 0; i < 40; i++) {
    p.posy += p.r;
    p.posx = ox;
    for(var j = 0; j < 40; j++) {
      p.posx += p.r * Math.sin(Math.PI / 3) * 2;
      grid.push({x: p.posx, y: p.posy});
      p.render(this.screen);
    }
  }
  return grid;
  // p.posx = ox = 20;
  // p.posy = 20;
  // for(var i = 0; i < 40; i++) {
  //   p.posy += p.r;
  //   p.posx = ox;
  //   for(var j = 0; j < 40; j++) {
  //     p.posx += p.r * 2;
  //     p.render(this.screen);
  //   }
  // }
}

Layer.prototype.select = function() {
  Layer.layers.forEach((layer) => layer.container.style.removeProperty('background-color'));
  this.container.style.backgroundColor = '#02404E';
}

Layer.prototype.clearGrid = function() {
  this.screen.context.clearRect(0,0,this.screen.width, this.screen.height);
}
