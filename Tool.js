function Tool(o) {
  this.id = o.id || uniqueId();
  this.name = o.name;
  if(typeof o.image == 'string') {
    this.image = new Image();
    this.image.src = o.image;
  } else {
    this.image = o.image;
  }
  this.activate = o.activate;
  this.image.addEventListener('click', () => {
    this.image.style.outline = '3px solid green';
    this.image.style.outlineOffset = '-4px';
    Tool.tools.forEach((t) => {
      if(t.id != this.id) {
        t.image.style.outline = '';
      }
    })
    Tool.selectedTool = this;
  }, false);

  Tool.tools.push(this);
}

Tool.container = document.getElementById('tools');
Tool.tools = [];
Tool.selectedTool;
Tool.render = function() {
  this.tools.forEach((t) => t.render());
}

Tool.prototype.render = function() {
  Tool.container.appendChild(this.image);
}
