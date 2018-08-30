function Swatch(canvasImage, x, y) {
  this.id = uniqueId();
  this.x = x;
  this.y = y;
  this.canvas = document.createElement('canvas');
  this.canvas.addEventListener('click', () => {
    Swatch.setActive(this);
    console.log(this.save())
  });

  this.image = canvasImage;
  this.canvas.width = 32;
  this.canvas.height = 32;
  this.render();
  Swatch.swatches.push(this);
}

Swatch.container = document.getElementById('swatches');
Swatch.swatches = [];
Swatch.setActive = function(swatch) {
  Swatch.activeSwatch = swatch;
  Swatch.select();
  SwatchCollection.select();
}
Swatch.select = function() {
  this.swatches.forEach(swatch => {
    if(Swatch.activeSwatch == swatch) {
      swatch.canvas.style.border = '1px solid #00ff00';
    } else {
      swatch.canvas.style.border = 'none';
    }
  })
}

Swatch.getSwatch = function(next) {
  if(this.activeSwatch instanceof SwatchCollection) {
    if(next) return this.activeSwatch.next();
    return this.activeSwatch.getSwatch();
  }
  return this.activeSwatch;
}
Swatch.getOnId = function(id) {
  return this.swatches.find(s => s.id == id);
}
Swatch.prototype.save = function() {
  return {
    x: this.x,
    y: this.y,
    id: this.id,
    selected: Swatch.activeSwatch == this
  }
}

Swatch.prototype.render = function() {
  let c = this.canvas;
  let ct = c.getContext('2d');
  ct.drawImage(this.image, 0,0,c.width, c.height);
}

Swatch.prototype.remove = function() {
  var i = Swatch.swatches.indexOf(this);
  Swatch.swatches.splice(i, 1);
  Swatch.container.removeChild(this.canvas.parentNode);
}

function SwatchCollection(swatches) {
  this.id = uniqueId();
  this.swatches = swatches || [];
  this.currentIndex = 0;
  this.order = 'random';
  this.canvas = document.createElement('canvas');
  this.canvas.addEventListener('click', () => {
    Swatch.setActive(this);
  });
  this.canvas.width = this.canvas.height = 32;
  this.render();
  SwatchCollection.items.push(this);
}

SwatchCollection.items = [];
SwatchCollection.container = document.getElementById('swatch-collections');

SwatchCollection.select = function() {
  this.items.forEach(swatch => {
    if(Swatch.activeSwatch == swatch) {
      swatch.canvas.style.border = '1px solid #00ff00';
    } else {
      swatch.canvas.style.border = 'none';
    }
  })
}

SwatchCollection.prototype.save = function() {
  return this.swatches.map(s => s.save());
}

SwatchCollection.prototype.remove = function() {
  var i = SwatchCollection.items.indexOf(this);
  SwatchCollection.items.splice(i, 1);
  SwatchCollection.container.removeChild(this.canvas.parentNode);
}

SwatchCollection.prototype.getSwatch = function() {
  return this.swatches[this.currentIndex];
}

SwatchCollection.prototype.next = function() {
  if(this.order == 'sequential') {
    this.currentIndex += 1;
  } else
  if(this.order == 'random') {
    this.currentIndex = Math.floor(Math.random() * this.swatches.length);
  }
  if(this.currentIndex > this.swatches.length - 1) {
    this.currentIndex = 0;
  }

  return this.getSwatch();
}

SwatchCollection.prototype.render = function() {
  let c = this.canvas;
  let ct = c.getContext('2d');
  let swatch = this.getSwatch();
  ct.drawImage(swatch.image, 0, 0, c.width, c.height);
}
