function Popup(label, content, buttons) {
  this.label = label;
  this.content = content;
  this.buttons = buttons || [];
  this.h = 440;
  this.w = 800;
  this.style = {
    position: 'fixed',
    display: 'inline-block',
    width: this.w + 'px',
    height: this.h + 'px',
    margin: 'auto',
    zIndex: 10,
    backgroundColor: 'white',
    top: 0,
    transform: 'translate(50%,50%)',
    left: 0

  };
  this.render();
}

Popup.prototype.render = function() {
  var container = document.createElement('div');
  setStyle(container, this.style);
  var top = document.createElement('div');
  var th = 64;
  top.textContent = this.label || 'Label';
  top.style.height = top.style.lineHeight = th + 'px';
  top.style.textAlign = 'center';
  container.appendChild(top);
  Array.isArray(this.content) && this.content.forEach((tag) => {
    container.appendChild(tag);
  });
  var bottom = document.createElement('div');
  bottom.style.height = '100%';
  bottom.style.width = '1px';
  bottom.style.maxHeight = this.h - th + 'px';
  bottom.style.float = 'right';
  container.appendChild(bottom);
  this.buttons.forEach((b) => {
    b.tag.style.verticalAlign = 'bottom';
    b.tag.style.float = 'right';
    b.tag.style.position = 'relative';
    b.tag.style.right = '-100px';
    bottom.appendChild(b.tag);
  })
  var onClose = () => document.body.removeChild(container);
  closeButton(bottom, onClose);
  container.appendChild(this.content)
  document.body.appendChild(container);

}


function setStyle(tag, style) {
  Object.keys(style).forEach((key) => {
    tag.style[key] = style[key];
  })
}

function closeButton(container, onClose) {
  var b = new Button('Cancel', 'button', onClose);
  b.tag.style.verticalAlign = 'bottom';
  b.tag.style.float = 'right';
  b.tag.style.position = 'relative';
  b.tag.style.right = '-100px';
  container.appendChild(b.tag);
}
