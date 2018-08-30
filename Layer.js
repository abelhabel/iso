function Layer(name, screenId) {
  var o = {};
  if(typeof name === 'object') {
    o = name;
  }
  this.id = o.id || uniqueId();
  this.container = document.createElement('div');
  this.container.className = 'layer';
  this.name = o.name || name;
  this.container.textContent = this.name;
  this.screenId = o.screenId || screenId;
  this.selected = o.selected;
  if(Screen.screens[this.screenId]) {
    this.screen = Screen.screens[this.screenId];

  } else {
    this.screen = new Screen(0,0, this.screenId);
  }
  this.stats = o.stats || {
    walkable: true,
    breakable: false
  };
  this.mouseEvents = {};
  this.on('mousedown', dragndrop);
  this.on('dblclick', layerSettings);
  Layer.layers.push(this);
  this.index = Layer.layers.length - 1;
  if(this.selected) this.select();
}

Layer.layers = [];

Layer.container = document.getElementById('layers')

Layer.getStats = function(layerId) {
  var l = Layer.layers.find(l => l.id == layerId);
  if(!l) return {};
  return l.stats;
}

Layer.save = function() {
  Layer.layers.forEach(l => l.save());
}

Layer.render = function() {
  this.layers.forEach((l) => l.render());
}

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

Layer.prototype.save = function() {
  return {
    id: this.id,
    name: this.name,
    screenId: this.screenId,
    stats: this.stats,
    selected: this.selected,
    index: this.index
  }
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
}

function reorderContainer(layer) {
  this.layers.sort((c, n) => {
    return parseInt(c.container.offsetTop) > parseInt(n.container.offsetTop) ? 1 : -1;
  })
  .forEach((l, i) => {
    l.index = i;
    this.container.appendChild(l.container);
    l.screen.canvas.style.zIndex = i;
    Screen.container.appendChild(l.screen.canvas)
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
  var content = document.createElement('div');
  var name = document.createElement('input');
  name.value = layer.name;
  name.addEventListener('keyup', () => {
    layer.name = name.value;
    layer.container.textContent = layer.name;
  })
  var invert = document.createElement('input');
  invert.type = 'checkbox';
  var visible = document.createElement('input');
  visible.type = 'checkbox';
  visible.checked = true;
  content.appendMany([new Wrap(name), new Wrap(invert, 'invert'), new Wrap(visible, 'visible')]);

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

  var onChange = (changes) => {
    Object.assign(layer.stats, changes);
    console.log('changes', changes);
  }

  var stats = [
    new Checkbox('walkable', layer.stats.walkable, onChange),
    new Checkbox('breakable', layer.stats.breakable, onChange)
  ];
  content.appendMany(stats.map(s => s.node));
  new Popup('Layer settings', content, buttons);
}

class Checkbox {
  constructor(name, checked, onChange) {
    this.name = name;
    this.checked = !!checked;
    this.node = this.createNode();
    this.checkbox.checked = this.checked;
    this.checkbox.addEventListener('change', () => {
      this.checked = this.checkbox.checked;
      onChange({[this.name]: this.checked});
    })
  }

  get checkbox() {
    return this.node.querySelector('input');
  }

  get label() {
    return this.node.querySelector('label');
  }

  createNode() {
    if(this.node) return this.node;
    var d = document.createElement('div');
    var html =  `<div>
      <input type='checkbox' name='checkbox'>
      <label for='checkbox'>${this.name}</label>
    </div>`;
    d.innerHTML = html;
    this.node = d.firstElementChild
    return this.node;
  }
}

Layer.prototype.select = function() {
  Layer.layers.forEach((layer) => {
    layer.selected = false;
    layer.container.style.removeProperty('background-color')
  });
  this.container.style.backgroundColor = '#02404E';
  this.selected = true;
  go.activeLayer = this;
  Layer.activeLayer = this;
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
