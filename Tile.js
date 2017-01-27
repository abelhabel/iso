function Tile(x, y, w, h, image, layerId) {
  this.id = uniqueId();
  this.x = x || 0;
  this.y = y || 0;
  this.w = w || 10;
  this.h = h || 10;
  this.hw = this.w/2;
  this.hh = this.h/2;
  this.stroke = this.fill = true;
  this.fillStyle = '#7E3E00';
  this.strokeStyle = '#D6B08B'
  this.image = image;
  this.layerId = layerId;
  this.stats = new Stats({
    walkable: true,
    breakable: false
  });
  this.setBB();
};

Tile.prototype.setBB = function() {
  this.xmin = this.x - this.hw;
  this.xmax = this.x + this.hw;
  this.ymin = this.y - this.hh;
  this.ymax = this.y + this.hh;
};


Tile.prototype.render = function(screen, ox, oy) {
  var c = screen.context;

  if(this.image) {
    return c.drawImage(this.image, this.x - ox, this.y - oy, this.w, this.h)
  }


  if(this.stroke) {
    c.strokeStyle = this.strokeStyle;
    c.strokeRect(this.x - ox, this.y - oy, this.w, this.h);
  }

  if(this.fill) {
    c.fillStyle = this.fillStyle;
    c.fillRect(this.x - ox, this.y - oy, this.w, this.h);
  }
};
