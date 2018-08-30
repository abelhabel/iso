function Tileset(image, x, y, w, h, scale) {
  var o = image;
  scale = o.scale || scale || 1;
  this.id = o.id || uniqueId();
  this.x = (o.x || x) * scale;
  this.y = (o.y || y) * scale;
  this.w = (o.w || w) * scale;
  this.h = (o.h || h ) * scale;
  this.currentIndexX = o.currentIndexX || 0;
  this.currentIndexY = o.currentIndexY || 0;
  this.swatches = [];
  this.swatchCollections = [];
  this.imageSrc = o.imageSrc || '';
  //DungeonCrawl_ProjectUtumnoTileset.png,32,32,2048,1536
  if(this.imageSrc) {
    this.image = new Image();
    this.fetching = this.fetch(this.imageSrc)
    .then(() => {
      this.setPart();
      this.currentIndexX = o.currentIndexX || 0;
      this.currentIndexY = o.currentIndexY || 0;
      this.updatePart();
      this.addSwatches(o.swatches);
      this.addSwatchCollections(o.swatchCollections || []);
    });
  } else
  if(typeof image == 'string') {
    this.imageSrc = image;
    this.save();
    this.image = new Image();
    this.fetching = this.fetch(image)
    .then(() => {
      this.setPart();
      // this.render();
    });
  } else {
    if(o.image) {
      this.image = new Image();
      this.image.src = o.image.src;
    } else {
      this.image = o.image || image;
    }
    this.setPart();
    this.fetching = Promise.resolve();
    // this.render();
  }
  this.cotr = 'Tileset';
  Tileset.tilesets.push(this);
}

Tileset.tilesets = [];
Tileset.container = document.getElementById('tilesets')

Tileset.render = function() {
  Tileset.tilesets.forEach((t) => {
    t.fetching
    .then(() => t.render());
  });
};

Tileset.removeSwatch = function(swatch) {
  Tileset.tilesets.forEach(t => {
    var index = t.swatches.findIndex(s => s.x == swatch.x && s.y == swatch.y);
    if(!~index) return;
    t.swatches.splice(index, 1);
  });
};

Tileset.save = function() {
  this.tilesets.forEach(t => t.save());
}
Tileset.prototype.save = function() {
  return {
    id: this.id,
    x: this.x,
    y: this.y,
    w: this.w,
    h: this.h,
    swatches: this.swatches.map(s => s.save()),
    swatchCollections: this.swatchCollections.map(c => c.map(s => s.save())),
    imageSrc: this.imageSrc,
    currentIndexX: this.currentIndexX,
    currentIndexY: this.currentIndexY
  };
}

Tileset.prototype.updatePart = function() {
  this.part.context.clearRect(0,0, this.w, this.h);
  this.part.context.drawImage(
    this.image,
    this.currentIndexX * this.x,
    this.currentIndexY * this.y,
    this.x,
    this.y,
    0,
    0,
    this.x,
    this.y
  );
}

Tileset.prototype.nextPart = function(prev) {
  var val = prev ? -1 : 1;
  this.currentIndexX += val;
  if(this.currentIndexX < 0) {
    var maxx = Math.floor(this.w / this.x) -1;
    this.currentIndexX = maxx;
    this.currentIndexY -= 1;
  }
  if(this.currentIndexY < 0) {
    var maxy = Math.floor(this.h / this.y) -1;
    this.currentIndexY = maxy;
    // this.currentIndexY -= 1;
  }
  if(this.currentIndexX >= this.w / this.x) {
    this.currentIndexX = 0;
    this.currentIndexY += val;
  }
  if(this.currentIndexY >= this.h / this.y) {
    this.currentIndexX = 0;
    this.currentIndexY = 0;
  }
  this.updatePart();
}

Tileset.prototype.setPart = function () {
  this.part = new Canvas(this.x, this.y);
  this.currentIndexX = this.currentIndexY = 0;
  this.updatePart();
}

function Sprite(image) {
  this.canvas = new Canvas(image.width, image.height);
  this.canvas.context.drawImage(image, 0, 0, image.width, image.height);
}


Tileset.prototype.getImageData = function() {
  var canvas = document.createElement('canvas');
  canvas.width = this.w;
  canvas.height = this.h;
  canvas.getContext('2d').drawImage(this.image, 0, 0,this.w, this.h);
  var data = canvas.toDataURL();
  return data;
}

Tileset.prototype.setScale = function(scale) {
  this.scale = scale;
  this.x = x * scale;
  this.y = y * scale;
  this.w = w * scale;
  this.h = h * scale;
}

Tileset.prototype.updateSize = function() {
  var canvas = document.createElement('canvas');
  canvas.width = this.w;
  canvas.height = this.h;
  canvas.getContext('2d').drawImage(this.image, 0, 0, this.w, this.h);
  var data = canvas.toDataURL();
  this.image.src = data;
  return data;
}

function deleteTag(onClick) {
  var del = document.createElement('div');
  del.style.height = '10px';
  del.style.width = '10px';
  del.style.position = 'absolute';
  del.style.top = del.style.left = '1px';
  del.style.color = 'white';
  del.style.textAlign = 'center';
  del.style.cursor = 'pointer';
  del.textContent = 'D';
  del.style.display = 'none';
  del.addEventListener('click', onClick);
  return del;
}

Tileset.prototype.render = function() {
  var arrowHeight = 24;
  var container = document.createElement('div');
  var del = deleteTag((e) => {
    Tileset.container.removeChild(container);
  });
  var add = document.createElement('div');
  add.style.height = '10px';
  add.style.width = '10px';
  add.style.position = 'absolute';
  add.style.top = '14px';
  add.style.left = '1px';
  add.style.color = 'white';
  add.style.textAlign = 'center';
  add.style.cursor = 'pointer';
  add.textContent = 'A';
  add.style.display = 'none';
  container.style.display = 'inline-block';
  container.style.position = 'relative';
  container.style.width = this.part.canvas.width + 'px';
  container.style.height = this.part.canvas.height + arrowHeight + 'px';
  var arrowLeft = new Arrow('<', arrowHeight);
  var arrowRight = new Arrow('>', arrowHeight);
  container.appendChild(this.part.canvas);
  container.appendChild(arrowLeft.tag);
  container.appendChild(arrowRight.tag);
  container.appendChild(del);
  container.appendChild(add);
  arrowLeft.on('click', () => this.nextPart(true));
  arrowRight.on('click', () => this.nextPart());
  this.part.canvas.disableContextmenu
  this.part.canvas.addEventListener('click', () => {
    this.openSelectTile();
  });
  this.part.canvas.addEventListener('mouseenter', () => {
    del.style.display = 'block';
    add.style.display = 'block';
  });
  this.part.canvas.addEventListener('mouseleave', (e) => {
    if(e.relatedTarget == del) return;
    if(e.relatedTarget == add) return;
    del.style.display = 'none';
    add.style.display = 'none';
  });

  add.addEventListener('click', (e) => {
    this.addSwatch({x: this.currentIndexX, y: this.currentIndexY});
  });
  Tileset.container.appendChild(container);
  return this;
}



Tileset.prototype.openSelectTile = function() {
  var container = document.createElement('div');
  container.style.backgroundColor = 'blanchedalmond';
  container.style.overflow = 'scroll';
  container.style.position = 'fixed';
  container.style.zIndex = 100;
  var w = window.innerWidth;
  var h = window.innerHeight;
  container.style.width = w + 'px';
  container.style.height = h + 'px';
  container.style.top = container.style.left = '0px';
  var canvas = document.createElement('canvas');
  var close = function(e) {
    if(e.keyCode == 27) {
      document.body.removeChild(container);
      window.removeEventListener('keyup', close);
    }
  }
  window.addEventListener('keyup', close);
  canvas.width = this.w;
  canvas.height = this.h;
  var c = canvas.getContext('2d');
  c.drawImage(this.image, 0, 0, this.w, this.h);
  var selected = [];
  canvas.addEventListener('click', e => {
    let x = Math.floor(e.offsetX / this.x);
    let y = Math.floor(e.offsetY / this.y);
    selected.push({x: x, y: y})
    if(!e.ctrlKey) {
      var i;
      if(e.shiftKey) {
        i = this.addSwatchCollection(selected);
      } else {
        i = this.addSwatches(selected);
      }
      document.body.removeChild(container);
    }
  })
  container.appendChild(canvas);
  document.body.appendChild(container);
}

function wrapSwatch(swatch, onDelete) {
  var container = document.createElement('div');
  container.style.display = 'inline-block';
  container.style.position = 'relative';
  // Swatch.activeSwatch = swatch;
  var del = deleteTag(onDelete);
  container.addEventListener('mouseenter', () => {
    del.style.display = 'block';
  });
  container.addEventListener('mouseleave', () => {
    del.style.display = 'none';
  });
  container.appendChild(del);
  container.appendChild(swatch.canvas);
  return container;
}

Tileset.prototype.addSwatchCollections = function(collections) {
  collections.forEach(positions => this.addSwatchCollection(positions));
  console.log('addSwatchCollections')
}

Tileset.prototype.addSwatchCollection = function(positions) {
  var swatches = positions.map(p => {
    this.currentIndexX = p.x;
    this.currentIndexY = p.y;
    this.updatePart();
    var s = new Swatch(this.part.canvas, p.x, p.y);
    if(p.id) s.id = p.id;
    if(p.selected) Swatch.setActive(s);
    s.render();
    return s;
  });
  var sc = new SwatchCollection(swatches)
  this.swatchCollections.push(sc.swatches);
  var c = wrapSwatch(sc, e => {
    var i = this.swatchCollections.length -1;
    this.swatchCollections.splice(i, 1);
    sc.remove();
  });
  SwatchCollection.container.appendChild(c);
}

Tileset.prototype.addSwatches = function(positions) {
  positions.forEach(p => {
    this.addSwatch(p);
  })
  console.log('addSwatches')
}

Tileset.prototype.addSwatch = function(p) {
  console.log('addSwatch', p)
  if(this.swatches.find(s => s.x == p.x && s.y == p.y)) return;
  this.currentIndexX = p.x;
  this.currentIndexY = p.y;
  this.updatePart();
  var s = new Swatch(this.part.canvas, p.x, p.y);
  if(p.id) s.id = p.id;
  if(p.selected) Swatch.setActive(s);
  var c = wrapSwatch(s, e => {
    var i = this.swatches.length -1;
    this.swatches.splice(i, 1);
    s.remove();
  });
  this.swatches.push(s);
  Swatch.container.appendChild(c);
}

function Arrow(symbol, height) {
  var a = document.createElement('div');
  a.style.height = a.style.lineHeight = height + 'px';
  a.className = 'arrow';
  a.textContent = symbol;
  this.tag = a;
}

Arrow.prototype.on = function(event, fn) {
  var handler = (e) => fn(e, this);
  this.tag.addEventListener(event, handler, false);
  return handler;
};

Tileset.prototype.fetch = function(url) {
  var that = this;
  return new Promise((resolve, reject) => {
    this.image.onload = function() {
      that.image.onload = null;
      resolve(that);
    };
    this.image.src = url;

  })
}
