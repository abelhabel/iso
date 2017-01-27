function Input(type, stat, label, val) {
  var typeModel = val.constructor;
  var event = getEventType(typeModel);
  console.log(event.type, val)
  this.container = document.createElement('div');
  this.input = document.createElement('input');
  this.input.type = getInputType(typeModel);
  this.input[event.key] = val;
  this.input.id = Math.random();
  this.label = document.createElement('div');
  this.label.style.display = 'inline-block';
  this.label.style.width = '50%'
  this.label.textContent = label;
  this.container.appendChild(this.label);
  this.container.appendChild(this.input);
  this.input.addEventListener(event.type, (e) => {
    stat[label] = typeModel(e.target[event.key]);
    console.log(stat, typeModel(e.target[event.key]))
  }, false);
  console.log(this)
}

function getInputType(model) {
  switch(model) {
    case String: return 'text'
    case Boolean: return 'checkbox'
  }
}

function getEventType(model) {
  switch(model) {
    case String: return {type: 'input', key: 'value'}
    case Boolean: return {type: 'click', key: 'checked'}
  }
}
