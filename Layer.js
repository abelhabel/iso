function Layer(name, screen) {
  this.id = uniqueId();
  this.container = document.createElement('div');
  this.container.className = 'layer';
  this.name = name;
  this.container.textContent = this.name;
  this.screen = screen;
  this.mouseEvents = {};
  this.on('mousedown', dragndrop);
  this.on('dblclick', layerSettings);
  Layer.layers.push(this);
}

Layer.layers = [];

Layer.container = document.getElementById('layers')

Layer.prototype.render = function() {
  this.container.addEventListener('click', () => this.select() , false);
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

function reorderContainer(layer) {
  var arr = this.layers.sort((c, n) => {
    return parseInt(c.container.offsetTop) > parseInt(n.container.offsetTop) ? 1 : -1;
  });
  arr.forEach((c, i) => {
    this.container.appendChild(arr[i].container);
    // arr[i].screen.canvas.dataset.index = i;
    arr[i].screen.canvas.style.zIndex = i;
    Screen.container.appendChild(arr[i].screen.canvas)
  });
  // layer.container.style.top = 0;
}

Layer.reorder = reorderContainer;

function dragndrop(e, layer) {
  if(layer.lastMouseDown && Date.now() - layer.lastMouseDown < 400) {
    return;
  }
  layer.lastMouseDown = Date.now();
  layer.select();
  var state = 'down';
  var tag = layer.container;
  tag.style.zIndex = 1;
  var x = e.x;
  var y = e.y;
  var move = (e2, layer) => {
    if(state == 'up') return;
    state = 'move';
    layer.container.style.top = e2.y - y + 'px';
  };
  var up = (e3, layer) => {
    state = 'up';
    Layer.reorder(layer);
    layer.container.style.zIndex = 0;


    layer.detach('mousemove', moveHandler);
    layer.detach('mouseup', upHandler);
    layer.container.style.top = 0;
  };
  var moveHandler = layer.on('mousemove', move);
  var upHandler = layer.on('mouseup', up)
};

function Wrap(tag, text) {
  var div = document.createElement('div');
  div.appendChild(tag);
  var span = document.createElement('span');
  span.textContent = text;
  div.appendChild(span);
  return div;
}

function layerSettings(e, layer) {
  var content, buttons, invert, visible, save;
  console.log('open layer settings')
  var content = document.createElement('div');
  var invert = document.createElement('input');
  invert.type = 'checkbox';
  var visible = document.createElement('input');
  visible.type = 'checkbox';
  visible.checked = true;
  content.appendMany([new Wrap(invert, 'invert'), new Wrap(visible, 'visible')]);

  invert.addEventListener('click', function(e) {
    layer.screen.settings({
      invert: this.checked
    })
  }, false);

  visible.addEventListener('click', function(e) {
    layer.screen.settings({
      visible: this.checked
    });
  }, false);
  var pop = new Popup('Layer settings', content, buttons);
}

Layer.prototype.select = function() {
  Layer.layers.forEach((layer) => layer.container.style.removeProperty('background-color'));
  this.container.style.backgroundColor = '#02404E';
  go.activeLayer = this;
}

Layer.prototype.clearGrid = function() {
  this.screen.context.clearRect(0,0,this.screen.width, this.screen.height);
}

Layer.prototype.on = function(event, fn) {
  this.mouseEvents[event] = this.mouseEvents[event] || [];
  var handler = (e) => fn(e, this);
  handler.index = this.mouseEvents[event].length;
  this.mouseEvents[event][handler.index] = handler;
  this.container.addEventListener(event, handler, false);
  return handler;
};

Layer.prototype.detach = function(event, fn) {
  delete this.mouseEvents[event][fn.index];
  this.container.removeEventListener(event, fn);
}
