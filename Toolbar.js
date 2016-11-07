function Toolbar() {

}

Toolbar.container = document.getElementById('toolbar');

Toolbar.tools = {
  swatch: new Tool('swatch', 64, 64)
}

Toolbar.setSwatch = function(canvas) {
  var c = document.createElement('canvas');
  c.width = canvas.width;
  c.height = canvas.height;
  c.getContext('2d').drawImage(canvas, 0,0,c.width, c.height);
  Toolbar.activeSwatch = c;
  Toolbar.tools.swatch.render(c);
}


function Tool(name, w, h) {
  this.tag = document.createElement('div');
  this.tag.className = 'tool';
  this.tag.style.width = (w || 20) + 'px';
  this.tag.style.height = (h || 20) + 'px';
  this.rotation = 0;
  this.tag.addEventListener('click', () => this.rotate(), false);

  Toolbar.container.appendChild(this.tag);
}


Tool.prototype.render = function(content) {
  if(this.content) {
    this.tag.removeChild(this.content);
  }
  this.content = content;
  console.log({content: content})
  this.tag.appendChild(content);
  return this;
}

Tool.prototype.rotate = function() {
  this.rotation += Math.PI/2;
  var w = this.content.width, h = this.content.height;
  var c = this.content.getContext('2d');
  c.translate(w/2, h/2);
  c.rotate(Math.PI/2);
  c.translate(-w/2, -h/2);
  c.drawImage(this.content,-w/2, -h/2,w, h);
}
