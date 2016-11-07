function Board(container) {
  this.container = container;

  this.w = this.container.offsetWidth;
  this.h = this.container.offsetHeight;

}

Board.prototype.on = function(event, fn) {
  var handler = (e) => fn(e, this);
  this.container.addEventListener(event, handler, false);
  return handler;
};

Board.prototype.detach = function(event, fn) {
  this.container.removeEventListener(event, fn);
}
