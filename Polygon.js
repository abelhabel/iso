if(typeof(require) == 'function') var Helpers = require("../../public/helpers.js");
function Polygon(x, y, r, p) {
  this.id = Math.random();
  this.posx = x || 0;
  this.posy = y || 0;
  this.r = r || 100;
  this.width = this.height = this.r * 2;
  this.rotation = Math.PI/2;
  this.points = p || 3;
  this.type = "polygon";
  this.lineThickness = 1;
  this.fillStyle = 'gray';
  this.strokeStyle = 'black';
  this.fill = this.stroke = true;
  this.cotr = "Polygon";
  this.setRadian();
  this.width = 2 * this.r * Math.sin(this.radian);
  this.height = 2 * this.r * Math.cos(this.radian);
}

function renderMany(screen) {
  this.forEach((p) => p.render(screen));
  return this;
}

Polygon.generate = function(amount, x,y,r,p) {
  var out = [];
  out.render = renderMany;
  for(var i = 0; i < amount; i++) {
    out.push(new Polygon(x,y,r,p));
  }
  return out;
};

Polygon.prototype.getRadian = function() {
  return Math.PI * 2 / this.points;
};
Polygon.prototype.setRadian = function() {
  this.radian = Math.PI * 2 / this.points;
};

Polygon.prototype.setPoints = function(p) {
  this.points = p || this.points;
  this.setRadian();
}
Polygon.prototype.getNodes = function() {
  var arr = [];
  for(var i = 0; i < this.points; i += 1) {
    var d = {};
    d.x = this.posx + this.r * Math.cos(i * this.radian + this.rotation);
    d.y = this.posy + this.r * Math.sin(i * this.radian + this.rotation) * (-1);
    arr.push(d);
  }
  return arr;
};

Polygon.prototype.render = function(screen) {
  var ox = 0, oy = 0;
  var ct = screen.context;
  ct.beginPath();

  var points = this.getNodes();
  ct.moveTo( (points[0].x - ox), (points[0].y - oy));
  for(var k = 0; k < points.length; k += 1) {
    var np = k + 1;
    if(k == points.length -1)
    {
        np = 0;
    }
    ct.lineTo( (points[np].x - ox), (points[np].y - oy));
    if(this.stroke) {
      ct.strokeStyle = this.strokeStyle;
      ct.lineWidth = this.lineThickness;
      ct.stroke();
    }
  }
  // ct.stroke();
  ct.closePath();
  if(this.fill) {
    ct.fillStyle = this.fillStyle;
    ct.fill();
  }
};

Polygon.prototype.renderISO = function(screen) {
  var ox = 0, oy = 0;
  var ct = screen.context;
  ct.beginPath();

  var pointsO = this.getNodes();
  var points;
  if(screen.face == 'top') {
    points = [
      {x: this.posx, y: this.posy},
      pointsO[1],
      pointsO[0],
      pointsO[5],
    ]
  } else
  if(screen.face == 'right') {
    points = [
      {x: this.posx, y: this.posy},
      pointsO[3],
      pointsO[4],
      pointsO[5],
    ]
  }

  ct.moveTo( (points[0].x - ox), (points[0].y - oy));
  for(var k = 0; k < points.length; k += 1) {
    var np = k + 1;
    if(k == points.length -1)
    {
        np = 0;
    }
    ct.lineTo( (points[np].x - ox), (points[np].y - oy));
    if(this.stroke) {
      ct.strokeStyle = this.strokeStyle;
      ct.lineWidth = this.lineThickness;
      ct.stroke();
    }
  }
  // ct.stroke();
  ct.closePath();
  if(this.fill) {
    ct.fillStyle = this.fillStyle;
    ct.fill();
  }
  // ct.strokeStyle = 'white';
  // ct.beginPath();
  // ct.moveTo(this.posx -ox, this.posy -oy);
  // ct.lineTo(points[1].x - ox, points[1].y - oy);
  // ct.closePath();
  // ct.stroke();
  // ct.beginPath();
  // ct.moveTo(this.posx -ox, this.posy -oy);
  // ct.lineTo(points[3].x - ox, points[3].y - oy);
  // ct.closePath();
  // ct.stroke();
  // ct.beginPath();
  // ct.moveTo(this.posx -ox, this.posy -oy);
  // ct.lineTo(points[5].x - ox, points[5].y - oy);
  // ct.closePath();
  // ct.stroke();
}

if(typeof module != 'undefined') module.exports = Polygon;
