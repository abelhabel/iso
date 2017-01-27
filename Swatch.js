function Swatch() {
  this.id = uniqueId();
  this.canvas = document.createElement('canvas');
  this.canvas.addEventListener('click', () => {
    Swatch.activeSwatch = this;
  }, false);
  Swatch.swatches.push(this);
}

Swatch.container = document.getElementById('swatches');
Swatch.swatches = [];
Swatch.setSwatch = function(canvas) {
  var swatch = new Swatch();
  var c = swatch.canvas;
  c.width = canvas.width;
  c.height = canvas.height;
  c.getContext('2d').drawImage(canvas, 0,0,c.width, c.height);
  Swatch.activeSwatch = swatch;
  Swatch.container.appendChild(c);
  // Swatch.tools.swatch.render(c);
}
