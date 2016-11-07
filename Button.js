function Button(label, className, onClick) {
  this.tag = document.createElement('div');
  this.tag.textContent = label;
  this.tag.className = className;
  this.tag.addEventListener('click', onClick, false);
};
