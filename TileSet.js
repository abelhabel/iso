function Tileset(image, x, y, w, h, scale) {
  var o = image;
  scale = o.scale || scale || 1;
  this.id = o.id || uniqueId();
  this.x = (o.x || x) * scale;
  this.y = (o.y || y) * scale;
  this.w = (o.w || w) * scale;
  this.h = (o.h || h ) * scale;
  if(typeof image == 'string') {
    this.image = new Image();
    this.fetching = this.fetch(image)
    .then(() => {
      // this.image = this.image;
      this.setPart();
      // this.render();
    });
  } else {
    if(o.image) {
      this.image = new Image();
      this.image.src = o.image.data;
    } else {
      this.image = o.image || image;
    }
    this.setPart();
    // this.render();
  }
  this.cotr = 'Tileset';
  Tileset.tilesets.push(this);
}

Tileset.tilesets = [];
Tileset.container = document.getElementById('tilesets')

Tileset.render = function() {
  Tileset.tilesets.forEach((t) => t.render());
};

Tileset.prototype.updatePart = function() {
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
  console.log('next', val)
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
    console.log('jump y')
    this.currentIndexX = 0;
    this.currentIndexY += val;
  }
  if(this.currentIndexY >= this.h / this.y) {
    console.log('reset')
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

Tileset.prototype.render = function() {
  var arrowHeight = 24;
  var container = document.createElement('div');
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
  container.style.display = 'inline-block';
  container.style.position = 'relative';
  container.style.width = this.part.canvas.width + 'px';
  container.style.height = this.part.canvas.height + arrowHeight + 'px';
  var arrowLeft = new Arrow('<', arrowHeight);
  var arrowRight = new Arrow('>', arrowHeight);
  container.appendChild(this.part.canvas);
  container.appendChild(arrowLeft.tag);
  container.appendChild(arrowRight.tag);
  container.appendChild(del)
  arrowLeft.on('click', () => this.nextPart(true));
  arrowRight.on('click', () => this.nextPart());
  this.part.canvas.addEventListener('click', () => {
    Swatch.setSwatch(this.part.canvas);
  }, false);
  this.part.canvas.addEventListener('mouseenter', () => {
    del.style.display = 'block';
  }, false);
  this.part.canvas.addEventListener('mouseleave', (e) => {
    if(e.relatedTarget == del) return;
    del.style.display = 'none';
  }, false);
  del.addEventListener('click', (e) => {
    var removed = go.db.tilesets.remove(this.id);
    if(removed) Tileset.container.removeChild(container);
  }, false);
  Tileset.container.appendChild(container);
  return this;
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
    var local = go.db.tilesets.get(this.id);
    if(local) {
      console.log('loaded local tileset')
      this.image.src = local;
      this.updateSize();
      return resolve(this);
    }
    this.image.onload = function() {
      resolve(this);
      this.data = that.getImageData();
      console.log('image is loaded', this.data)
      go.db.tilesets.set(that.id, that);
    };
    console.log('setting src for tileset')
    this.image.src = url;

  })
}
