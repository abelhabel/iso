function Tool(o) {
  this.id = o.id || uniqueId();
  this.name = o.name;
  if(typeof o.image == 'string') {
    this.image = new Image();
    this.image.src = o.image;
  } else {
    this.image = o.image;
  }
  this.preactivate = o.preactivate;
  this.activate = o.activate;
  this.deactivate = o.deactivate;
  if(this.image) {
    this.tag = this.image;
  } else {
    this.tag = document.createElement('div');
    this.tag.textContent = this.name.substr(0,3);
  }

  this.tag.classList.add('tool');

  this.tag.addEventListener('click', () => {
    Tool.selectedTool && typeof Tool.selectedTool.deactivate == 'function' && Tool.selectedTool.deactivate();
    this.tag.style.outline = '3px solid green';
    this.tag.style.outlineOffset = '-4px';
    Tool.tools.forEach((t) => {
      if(t.id != this.id) {
        t.tag.style.outline = '';
      }
    })
    typeof this.preactivate == 'function' && this.preactivate();
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
  Tool.container.appendChild(this.tag);
}
